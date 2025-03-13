from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pymavlink import mavutil
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to establish MAVLink connection
def connect_mavlink():
    while True:
        try:
            conn = mavutil.mavlink_connection("tcp:127.0.0.1:5760")
            conn.wait_heartbeat()
            print("✅ MAVLink Connected!")
            return conn
        except Exception as e:
            print(f"⚠️ Connection failed, retrying... {e}")
            asyncio.sleep(2)  # Wait before retrying

# Establish initial connection
connection = connect_mavlink()

async def send_telemetry(websocket: WebSocket):
    await websocket.accept()
    print("✅ WebSocket Client Connected!")

    try:
        while True:
            global connection  # Use the global connection
            if connection is None:
                connection = connect_mavlink()  # Reconnect if lost
            
            msg = connection.recv_match(type=["GLOBAL_POSITION_INT", "ATTITUDE"], blocking=True)
            if msg:
                data = msg.to_dict()
                print("📡 [Backend] Raw MAVLink Data:", data)  # ✅ Debug print

                telemetry = {
                    "altitude": round(data.get("relative_alt", 0) / 1000, 2),  # ✅ Convert mm → meters
                    "yaw_degrees": round(data.get("yaw", 0) * (180 / 3.141592653589793), 2),
                    "latitude": round(data.get("lat", 0) / 1e7, 6) if "lat" in data else None,  # ✅ Convert to degrees
                    "longitude": round(data.get("lon", 0) / 1e7, 6) if "lon" in data else None  # ✅ Convert to degrees
                }

                print("📡 [Backend] Processed Telemetry:", telemetry)  # ✅ Check values sent to frontend
                await websocket.send_json(telemetry)
            await asyncio.sleep(1)  # Reduce frequency
    except WebSocketDisconnect:
        print("❌ WebSocket Client Disconnected!")
    except Exception as e:
        print(f"⚠️ Error: {e}")
    finally:
        await websocket.close()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await send_telemetry(websocket)

@app.get("/heartbeat")
async def send_heartbeat():
    """ Send manual heartbeat to drone """
    global connection
    if connection is None:
        connection = connect_mavlink()  # Reconnect if lost

    connection.mav.heartbeat_send(
        type=1, autopilot=6, base_mode=0, custom_mode=0, system_status=0
    )
    return {"message": "Heartbeat sent!"}

if _name_ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)