# B4
# --- 2. ส่วนของตัวรับสัญญาณ (ฝั่งหุ่นยนต์) ---

def on_received_string(receivedString):
    # ควบคุมการวิ่ง (มอเตอร์ล้อ)
    if receivedString == "F":
        iBIT.set_motor(ibitMotorCH.M1, ibitMotor.FORWARD, 50)
        iBIT.set_motor(ibitMotorCH.M2, ibitMotor.FORWARD, 50)
    elif receivedString == "B":
        iBIT.set_motor(ibitMotorCH.M1, ibitMotor.BACKWARD, 50)
        iBIT.set_motor(ibitMotorCH.M2, ibitMotor.BACKWARD, 50)
    elif receivedString == "L":
        iBIT.set_motor(ibitMotorCH.M1, ibitMotor.FORWARD, 50)
        iBIT.set_motor(ibitMotorCH.M2, ibitMotor.BACKWARD, 50)
    elif receivedString == "R":
        iBIT.set_motor(ibitMotorCH.M1, ibitMotor.BACKWARD, 50)
        iBIT.set_motor(ibitMotorCH.M2, ibitMotor.FORWARD, 50)
    elif receivedString == "S":
        iBIT.motor_stop()
    elif receivedString == "C":
        basic.show_icon(IconNames.YES)
        iBIT.servo(ibitServo.SV2, 90)
    elif receivedString == "W":
        basic.show_icon(IconNames.NO)
        iBIT.servo(ibitServo.SV2, 10)
    elif receivedString == "U":
        iBIT.servo(ibitServo.SV1, 90)
    elif receivedString == "D":
        iBIT.servo(ibitServo.SV1, 10)
radio.on_received_string(on_received_string)

joy_x = 0
joy_y = 0
# --- 1. ตั้งค่าเริ่มต้น (Setup) ---
radio.set_group(1)
pins.digital_write_pin(DigitalPin.P0, 1)
# ตั้งค่าพินปุ่มกดให้เป็นปกติ (Active Low)
pins.set_pull(DigitalPin.P13, PinPullMode.PULL_UP)
# B1
pins.set_pull(DigitalPin.P14, PinPullMode.PULL_UP)
# B2
pins.set_pull(DigitalPin.P15, PinPullMode.PULL_UP)
# B3
pins.set_pull(DigitalPin.P16, PinPullMode.PULL_UP)
# --- 3. ส่วนของตัวส่งสัญญาณ (ฝั่งรีโมท) ---

def on_forever():
    global joy_y, joy_x
    # อ่านค่าจอยสติ๊ก (ควบคุมการวิ่ง)
    joy_y = pins.analog_read_pin(AnalogPin.P1)
    joy_x = pins.analog_read_pin(AnalogPin.P2)
    if joy_y < 400:
        # ดันขึ้น -> เดินหน้า
        radio.send_string("F")
    elif joy_y > 800:
        # ดึงลง -> ถอยหลัง
        radio.send_string("B")
    elif joy_x < 400:
        # โยกซ้าย -> เลี้ยวซ้าย
        radio.send_string("L")
    elif joy_x > 800:
        # โยกขวา -> เลี้ยวขวา
        radio.send_string("R")
    else:
        radio.send_string("S")
    # อ่านค่าปุ่มกด (ควบคุมแขนกล)
    if pins.digital_read_pin(DigitalPin.P13) == 0:
        # ปุ่ม B1 (แดง) ➜ หนีบ
        radio.send_string("C")
    elif pins.digital_read_pin(DigitalPin.P16) == 0:
        # ปุ่ม B4 (เหลือง) ➜ ปล่อย
        radio.send_string("W")
    elif pins.digital_read_pin(DigitalPin.P14) == 0:
        # ปุ่ม B2 (เขียว) ➜ ยกขึ้น
        radio.send_string("U")
    elif pins.digital_read_pin(DigitalPin.P15) == 0:
        # ปุ่ม B3 (น้ำเงิน) ➜ วางลง
        radio.send_string("D")
    basic.pause(100)
basic.forever(on_forever)
