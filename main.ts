// B4
// --- 2. ส่วนของตัวรับสัญญาณ (ฝั่งหุ่นยนต์) ---
radio.onReceivedString(function (receivedString) {
    // ควบคุมการวิ่ง (มอเตอร์ล้อ)
    if (receivedString == "F") {
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Forward, 50)
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Forward, 50)
    } else if (receivedString == "B") {
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Backward, 50)
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Backward, 50)
    } else if (receivedString == "L") {
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Forward, 50)
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Backward, 50)
    } else if (receivedString == "R") {
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Backward, 50)
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Forward, 50)
    } else if (receivedString == "S") {
        iBIT.MotorStop()
    } else if (receivedString == "C") {
        basic.showIcon(IconNames.Yes)
        iBIT.Servo(ibitServo.SV2, 90)
    } else if (receivedString == "W") {
        basic.showIcon(IconNames.No)
        iBIT.Servo(ibitServo.SV2, 10)
    } else if (receivedString == "U") {
        basic.showIcon(IconNames.Triangle)
        iBIT.Servo(ibitServo.SV1, 90)
    } else if (receivedString == "D") {
        basic.showIcon(IconNames.LeftTriangle)
        iBIT.Servo(ibitServo.SV1, 10)
    }
})
let joy_x = 0
let joy_y = 0
// --- 1. ตั้งค่าเริ่มต้น (Setup) ---
radio.setGroup(1)
pins.digitalWritePin(DigitalPin.P0, 1)
// ตั้งค่าพินปุ่มกดให้เป็นปกติ (Active Low)
pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
// B1
pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
// B2
pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
// B3
pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
// --- 3. ส่วนของตัวส่งสัญญาณ (ฝั่งรีโมท) ---
basic.forever(function () {
    // อ่านค่าจอยสติ๊ก (ควบคุมการวิ่ง)
    joy_y = pins.analogReadPin(AnalogPin.P1)
    joy_x = pins.analogReadPin(AnalogPin.P2)
    if (joy_y < 400) {
        // ดันขึ้น -> เดินหน้า
        radio.sendString("F")
    } else if (joy_y > 800) {
        // ดึงลง -> ถอยหลัง
        radio.sendString("B")
    } else if (joy_x < 400) {
        // โยกซ้าย -> เลี้ยวซ้าย
        radio.sendString("L")
    } else if (joy_x > 800) {
        // โยกขวา -> เลี้ยวขวา
        radio.sendString("R")
    } else {
        radio.sendString("S")
    }
    // อ่านค่าปุ่มกด (ควบคุมแขนกล)
    if (pins.digitalReadPin(DigitalPin.P13) == 0) {
        // ปุ่ม B1 (แดง) ➜ หนีบ
        radio.sendString("C")
    } else if (pins.digitalReadPin(DigitalPin.P16) == 0) {
        // ปุ่ม B4 (เหลือง) ➜ ปล่อย
        radio.sendString("W")
    } else if (pins.digitalReadPin(DigitalPin.P14) == 0) {
        // ปุ่ม B2 (เขียว) ➜ ยกขึ้น
        radio.sendString("U")
    } else if (pins.digitalReadPin(DigitalPin.P15) == 0) {
        // ปุ่ม B3 (น้ำเงิน) ➜ วางลง
        radio.sendString("D")
    }
    basic.pause(100)
})
