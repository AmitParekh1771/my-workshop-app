import { City, Country, State, Timestamp } from "./form-data-model";
import { SelectItem } from "./select-item.model";
import { Md5 } from 'ts-md5';

export class User {
    firstName = '';
    lastName = '';
    name = '';
    email = '';
    photoURL = '';
    dateOfBirth: Timestamp | null = null;
    gender: SelectItem | null = null;
    profession: SelectItem | null = null;
    areaOfInterest: SelectItem[] = [];
    country: Country | null = null;
    state: State | null = null;
    city: City | null = null;

    wids: string[] = [];
    totalEnrolled = 0;
    totalCompleted = 0;
    creditPoints = 0;
    certificates: string[] = [];

    createdAt = Timestamp.now().toMillis();
    updatedAt = Timestamp.now().toMillis();
    deletedAt: number | null = null;

    constructor(name?: string, email?: string) {
        this.name = name || '';
        this.email = email || '';
        this.firstName = this.name.split(' ')[0] || '';
        this.lastName = this.name.split(' ')[1] || '';
        this.photoURL = `https://www.gravatar.com/avatar/${new Md5().appendStr((this.email).toLowerCase().trim()).end()}?s=200&d=mm&r=g`;
    }
}

export class Creator {
    wids: string[] = [];
    name = '';
    email = '';
    photoURL = '';
    totalActive = 0;
    totalArchived = 0;
    totalCompleted = 0;
    averageRating = 0;
    studentsTaught = 0;

    createdAt = Timestamp.now().toMillis();
    updatedAt = Timestamp.now().toMillis();
    deletedAt: number | null = null;

    constructor(name?: string, email?: string) {
        this.name = name || '';
        this.email = email || '';
        this.photoURL = `https://www.gravatar.com/avatar/${new Md5().appendStr((email || '').toLowerCase().trim()).end()}?s=200&d=mm&r=g`;
    }
}

export class Admin {
    wids: string[] = [];
    name = '';
    email = '';
    photoURL = '';

    createdAt = Timestamp.now().toMillis();
    updatedAt = Timestamp.now().toMillis();
    deletedAt: number | null = null;
    
    constructor(name?: string, email?: string) {
        this.name = name || '';
        this.email = email || ''; 
        this.photoURL = `https://www.gravatar.com/avatar/${new Md5().appendStr((email || '').toLowerCase().trim()).end()}?s=200&d=mm&r=g`;
    }
}

export class Role {
    role: 'student' | 'creator' | 'admin' = 'student';
    
    createdAt = Timestamp.now().toMillis();
    updatedAt = Timestamp.now().toMillis();
    deletedAt: number | null = null;

    constructor(role: 'student' | 'creator' | 'admin') {
        this.role = role;
    }
}
