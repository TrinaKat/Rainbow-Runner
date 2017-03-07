class MovementFSM {
	constructor() {
		// Constants
		this.initAccelSpeed = 0.025;
		this.accelRate = 0.015;
		this.framesToMax = 4;
		this.deaccelRate = .04;
		this.maxMoveSpeed = this.initAccelSpeed + this.framesToMax * this.accelRate;

		this.moveEnum = {
			RIGHT: 1,
			LEFT: -1,
			NONE: 0
		};
		this.moveDir = this.moveEnum.NONE;
		this.lateralSpeed = 0;	// magnitude, not a vector
		this.prevMaxLateralSpeed = 0;

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
		if (!right && !left) {
			// Released all movement keys, deaccelerate
			this.prevMaxLateralSpeed = this.lateralSpeed;
			switch(this.curState) {
				case this.stateEnum.ACCEL_RIGHT:
				case this.stateEnum.MOVE_RIGHT:
					this.curState = this.stateEnum.DEACCEL_RIGHT;
					break;
				case this.stateEnum.ACCEL_LEFT:
				case this.stateEnum.MOVE_LEFT:
					this.curState = this.stateEnum.DEACCEL_LEFT;
					break;
				default:
					break;
			}
		}
		switch(this.curState) {
		case this.stateEnum.NOT_TURNING:
			if (right && !left) {
				this.lateralSpeed = this.initAccelSpeed;
				this.curState = this.stateEnum.ACCEL_RIGHT;
			}
			else if (left && !right) {
				this.lateralSpeed = this.initAccelSpeed;
				this.curState = this.stateEnum.ACCEL_LEFT;
			}
			break;
		
		case this.stateEnum.ACCEL_RIGHT:
			this.moveDir = this.moveEnum.RIGHT;

			if (!right && !left) {
				// Released all movement keys, deaccelerate
				this.prevMaxLateralSpeed = this.lateralSpeed;
				this.curState = this.stateEnum.DEACCEL_RIGHT;
			}
			else if (left) {
				this.lateralSpeed = this.initAccelSpeed;
				this.curState = this.stateEnum.ACCEL_LEFT;
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
			this.moveDir = this.moveEnum.LEFT;

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

		case this.stateEnum.DEACCEL_RIGHT:
			if (left) {
				this.lateralSpeed = this.initAccelSpeed;
				this.curState = this.stateEnum.ACCEL_LEFT;
			}
			else if (right) {
				this.curState = this.stateEnum.ACCEL_RIGHT;
			}

			this.lateralSpeed -= this.deaccelRate;
			if (this.lateralSpeed <= 0) {
				this.resetMovement();
			}
			break;

		case this.stateEnum.DEACCEL_LEFT:
			if (right) {
				this.lateralSpeed = this.initAccelSpeed;
				this.curState = this.stateEnum.ACCEL_RIGHT;
			}
			else if (left) {
				this.curState = this.stateEnum.ACCEL_LEFT;
			}

			this.lateralSpeed -= this.deaccelRate;
			if (this.lateralSpeed <= 0) {
				this.resetMovement();
			}
			break;

		default:
			break;
		}
	}
}