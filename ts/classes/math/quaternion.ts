import { Vector3 } from './vector3';

/**
 * Represents a rotation in 3D space using a quaternion
 * q = w + xi + yj + zk where w is the scalar component and (x,y,z) is the vector component
 */
export class Quaternion {
    constructor(
        public w: number,
        public x: number,
        public y: number,
        public z: number
    ) {}
    
    /**
     * Create an identity quaternion (no rotation)
     */
    public static identity(): Quaternion {
        return new Quaternion(1, 0, 0, 0);
    }
    
    /**
     * Create a quaternion from an axis and angle
     * @param axis The axis to rotate around (must be normalized)
     * @param angle The angle in radians
     */
    public static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
        const halfAngle = angle * 0.5;
        const s = Math.sin(halfAngle);
        return new Quaternion(
            Math.cos(halfAngle),
            axis.x * s,
            axis.y * s,
            axis.z * s
        );
    }
    
    /**
     * Create a quaternion from Euler angles (in radians)
     */
    public static fromEuler(x: number, y: number, z: number): Quaternion {
        const cx = Math.cos(x * 0.5);
        const cy = Math.cos(y * 0.5);
        const cz = Math.cos(z * 0.5);
        const sx = Math.sin(x * 0.5);
        const sy = Math.sin(y * 0.5);
        const sz = Math.sin(z * 0.5);
        
        return new Quaternion(
            cx * cy * cz + sx * sy * sz,
            sx * cy * cz - cx * sy * sz,
            cx * sy * cz + sx * cy * sz,
            cx * cy * sz - sx * sy * cz
        );
    }
    
    /**
     * Multiply this quaternion by another (compose rotations)
     */
    public multiply(other: Quaternion): Quaternion {
        return new Quaternion(
            this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
            this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
            this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
            this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w
        );
    }
    
    /**
     * Get the conjugate of this quaternion
     */
    public conjugate(): Quaternion {
        return new Quaternion(this.w, -this.x, -this.y, -this.z);
    }
    
    /**
     * Get the magnitude (length) of this quaternion
     */
    public magnitude(): number {
        return Math.sqrt(
            this.w * this.w +
            this.x * this.x +
            this.y * this.y +
            this.z * this.z
        );
    }
    
    /**
     * Normalize this quaternion
     */
    public normalize(): Quaternion {
        const mag = this.magnitude();
        if (mag === 0) return Quaternion.identity();
        
        return new Quaternion(
            this.w / mag,
            this.x / mag,
            this.y / mag,
            this.z / mag
        );
    }
    
    /**
     * Rotate a vector by this quaternion
     */
    public rotate(v: Vector3): Vector3 {
        // Convert vector to quaternion
        const vq = new Quaternion(0, v.x, v.y, v.z);
        
        // q * v * q^-1
        const result = this.multiply(vq).multiply(this.conjugate());
        
        return new Vector3(result.x, result.y, result.z);
    }
    
    /**
     * Spherical linear interpolation between two quaternions
     */
    public static slerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
        // Ensure we take the shortest path
        let dot = a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
        
        let bx = b.x;
        let by = b.y;
        let bz = b.z;
        let bw = b.w;
        
        if (dot < 0) {
            dot = -dot;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        
        if (dot > 0.9995) {
            // Linear interpolation for very small angles
            return new Quaternion(
                a.w + (bw - a.w) * t,
                a.x + (bx - a.x) * t,
                a.y + (by - a.y) * t,
                a.z + (bz - a.z) * t
            ).normalize();
        }
        
        // Spherical interpolation
        const theta0 = Math.acos(dot);
        const theta = theta0 * t;
        const sinTheta = Math.sin(theta);
        const sinTheta0 = Math.sin(theta0);
        
        const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
        const s1 = sinTheta / sinTheta0;
        
        return new Quaternion(
            a.w * s0 + bw * s1,
            a.x * s0 + bx * s1,
            a.y * s0 + by * s1,
            a.z * s0 + bz * s1
        );
    }
    
    /**
     * Convert to a string representation
     */
    public toString(): string {
        return `Quaternion(${this.w}, ${this.x}, ${this.y}, ${this.z})`;
    }
} 