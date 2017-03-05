class MovementFSM {
	constructor() {
		// Constants
		this.initAccelSpeed = 0.01;
		this.accelRate = 0.01;
		this.framesToMax = 6;
		this.framesToDeaccel = 4;
		this.maxMoveSpeed = this.initAccelSpeed + this.framesToMax * this.accelRate;

		this.moveEnum = {
			RIGHT: 1,
			LEFT: -1,
			NONE: 0
		};
		this.moveDir = this.moveEnum.NONE;
		this.lateralSpeed = 0;	// magnitude, not a vector

		this.stateEnum = {
			NOT_TURNING: 0,
			ACCEL_RIGHT: 1,
			MOVE_RIGHT: 2,
			DEACCEL_RIGHT: 3,
			ACCEL_LEFT: 4,
			MOVE_LEFT: 5,
			DEACCEL_LEFT: 6
		};
		this.curState = this.stateEnum.NOT_TURNING;
	}

	get velocity() {
		// The output that we care about
		return this.moveDir * this.lateralSpeed;
	}

	resetMovement() {
		this.lateralSpeed = 0;
		this.moveDir = this.moveEnum.NONE;
		this.curState = this.stateEnum.NOT_TURNING;
	}

	update(right, left) {
		// Our actual FSM

		switch(this.curState) {
		case this.stateEnum.NOT_TURNING:
			if (right && !left) {
				this.lateralSpeed = this.initAccelSpeed;
				this.moveDir = this.moveEnum.RIGHT;
				this.curState = this.stateEnum.ACCEL_RIGHT;
			}
			else if (left && !right) {
				this.lateralSpeed = this.initAccelSpeed;
				this.moveDir = this.moveEnum.LEFT;
				this.curState = this.stateEnum.ACCEL_LEFT;
			}
			break;
		
		case this.stateEnum.ACCEL_RIGHT:
			if (!right || left) {
				this.resetMovement();
			}
			else if (this.lateralSpeed == this.maxMoveSpeed) {
				this.curState = this.stateEnum.MOVE_RIGHT;
			}
			else {
				this.lateralSpeed += this.accelRate;
			}
			break;
		
		case this.stateEnum.MOVE_RIGHT:
			if (!right || left) {
				this.resetMovement();
			}
			break;
		
		case this.stateEnum.ACCEL_LEFT:
			if (!left || right) {
				this.resetMovement();
			}
			else if (this.lateralSpeed == this.maxMoveSpeed) {
				this.curState = this.stateEnum.MOVE_LEFT;
			}
			else {
				this.lateralSpeed += this.accelRate;
			}
			break;

		case this.stateEnum.MOVE_LEFT:
			if (!left || right) {
				this.resetMovement();
			}
			break;

		default:
			break;
		}
	}
}