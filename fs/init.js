load('api_timer.js');
load('api_config.js');
load('api_pwm.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');

let DELAY = 1;
let pin = Cfg.get('app.pin');
let led = 2;
//let onAngles = [0.102,0.086,0.07,0.055];
//let offAngles = [0.07, 0.086,0.102, 0.12];
let onAngles = [0.11, 0.1, 0.09, 0.08, 0.07, 0.06, 0.055];
let offAngles = [0.065, 0.075, 0.085, 0.095, 0.105, 0.115, 0.12];
let gateStatus = 'OFF';
let servoStateTopic = 'custom/servo/state';
GPIO.set_mode(2, GPIO.MODE_OUTPUT);
GPIO.toggle(led);
PWM.set(pin, 50, 0.12);
MQTT.pub(servoStateTopic, gateStatus);

function sleep(seconds) {
    let now = Sys.uptime();
    let current = Sys.uptime();
    while(current - now < seconds){
        current = Sys.uptime();
    }
}

function switchServo(angles){
    if(angles.length === 7){
        print('-----start-----');
        sleep(DELAY);
        PWM.set(pin, 50, angles[0]);
        print('-------1-------');
        GPIO.toggle(led);
        sleep(DELAY);
        PWM.set(pin, 50, angles[1]);
        print('-------2-------');
        GPIO.toggle(led);
        sleep(DELAY);
        PWM.set(pin, 50, angles[2]);
        print('-------3-------');
        GPIO.toggle(led);
        sleep(DELAY);
        PWM.set(pin, 50, angles[3]);
        print('-------4-------');
        GPIO.toggle(led);
        sleep(DELAY);
        PWM.set(pin, 50, angles[4]);
        print('-------5-------');
        GPIO.toggle(led);
        sleep(DELAY);
        PWM.set(pin, 50, angles[5]);
        print('-------6-------');
        GPIO.toggle(led);
        sleep(DELAY);
        PWM.set(pin, 50, angles[6]);
        GPIO.toggle(led);
        GPIO.write(led, 1);
        print('-----stop------');
    }
}



MQTT.sub('custom/servo', function(conn, topic, msg) {
    print('Topic:', topic, 'message:', msg);
    let change = JSON.parse(msg);
    print('Change:' , change);
    PWM.set(pin, 50, change.duty);
  }, null);

MQTT.sub('custom/servo/gate', function(conn, topic, msg) {
    print('Topic:', topic, 'message:', msg); 
    if(msg === 'ON' && gateStatus === 'OFF'){
        switchServo(onAngles);
        gateStatus = 'ON';
        MQTT.pub(servoStateTopic, gateStatus);
    } else if(msg === 'OFF' && gateStatus === 'ON'){
        switchServo(offAngles);
        gateStatus = 'OFF';
        MQTT.pub(servoStateTopic, gateStatus);
    }
  }, null);





