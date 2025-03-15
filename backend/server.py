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
    """ Continuously send telemetry and log messages over WebSocket """
    await websocket.accept()
    print("✅ WebSocket Client Connected!")

    try:
        while True:
            global connection  
            if connection is None:
                connection = connect_mavlink()  # Reconnect if lost

            # Fetch telemetry messages
            msg = connection.recv_match(blocking=True)

            if msg:
                data = msg.to_dict()
                print("📡 [Backend] Raw MAVLink Data:", data)  # Debug print

                # Extract telemetry data
                telemetry = {
                    "altitude": round(data.get("relative_alt", 0) / 1000, 2) if "relative_alt" in data else None,  # mm → meters
                    "ground_speed": round(data.get("groundspeed", 0), 2) if "groundspeed" in data else None,  # m/s
                    "vertical_speed": round(data.get("climb", 0), 2) if "climb" in data else None,  # m/s
                    "yaw_degrees": round(data.get("yaw", 0) * (180 / 3.141592653589793), 2) if "yaw" in data else None,  # Radians → Degrees
                    "heading": data.get("heading", None),  # Degrees (0-360)
                    "latitude": round(data.get("lat", 0) / 1e7, 6) if "lat" in data else None,  # Convert to degrees
                    "longitude": round(data.get("lon", 0) / 1e7, 6) if "lon" in data else None,  # Convert to degrees
                    "log_message": None, 
                     "raw_data":data, # Placeholder for log messages
                }

                # Fetch log messages (STATUSTEXT)
                if msg.get_type() == "STATUSTEXT":
                    telemetry["log_message"] = msg.text  # Get the log message text

                print("📡 [Backend] Processed Telemetry:", telemetry)  # Debug print

                # Send data to frontend
                await websocket.send_json(telemetry)

            await asyncio.sleep(1)  # Reduce frequency to 1Hz
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

@app.post("/takeoff/{altitude}")
async def takeoff(altitude: float):
    """ Command drone to take off """
    global connection
    if connection is None:
        connection = connect_mavlink()

    try:
        connection.arducopter_arm()  # Arm the drone
        print("✅ Drone Armed!")

        connection.mav.command_long_send(
            connection.target_system,
            connection.target_component,
            mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
            0,
            0, 0, 0, 0, 0, 0, altitude
        )
        print(f"🛫 Takeoff Command Sent: Altitude {altitude}m")
        return {"message": f"Takeoff initiated to {altitude}m!"}
    except Exception as e:
        return {"error": f"Failed to take off: {str(e)}"}
    
@app.post("/change_altitude/{altitude}")
async def change_altitude(altitude: float):
    """ Change drone's altitude mid-flight """
    global connection
    if connection is None:
        connection = connect_mavlink()

    try:
        connection.mav.command_long_send(
            connection.target_system,
            connection.target_component,
            mavutil.mavlink.MAV_CMD_CONDITION_CHANGE_ALT,
            0,
            altitude, 0, 0, 0, 0, 0, 0
        )
        print(f"📡 Altitude Change Command Sent: New Altitude {altitude}m")
        return {"message": f"Altitude changing to {altitude}m!"}
    except Exception as e:
        return {"error": f"Failed to change altitude: {str(e)}"}

@app.post("/land")
async def land():
    """ Command drone to land """
    global connection
    if connection is None:
        connection = connect_mavlink()

    try:
        connection.mav.command_long_send(
            connection.target_system,
            connection.target_component,
            mavutil.mavlink.MAV_CMD_NAV_LAND,
            0,
            0, 0, 0, 0, 0, 0, 0
        )
        print("🛬 Landing Command Sent!")
        return {"message": "Landing initiated!"}
    except Exception as e:
        return {"error": f"Failed to land: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
