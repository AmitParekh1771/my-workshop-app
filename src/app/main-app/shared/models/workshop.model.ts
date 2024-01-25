import { Timestamp } from "./form-data-model";
import { SelectItem } from "./select-item.model"
import { Creator } from "./user.model";

export class Workshop {
    status: Status = new Status();
    metaData: MetaData;

    courseId = Timestamp.now().toMillis();

    creators: Creator[] = [];
    creatorsId: string[] = [];

    folderUri = '';

    createdAt = Timestamp.now().toMillis();
    updatedAt = Timestamp.now().toMillis();
    deletedAt: number | null = null;

    constructor(title: string, folderUri: string, creator: Creator, creatorId: string) {
        this.metaData = new MetaData(title);
        this.folderUri = folderUri;
        this.creators.push(creator);
        this.creatorsId.push(creatorId);
    }
}

export class ContentDoc {
    content: Content[] = [];

    createdAt = Timestamp.now().toMillis();
    updatedAt = Timestamp.now().toMillis();
    deletedAt: number | null = null;
}

export class Status {
    id: 1 | 2 | 3 | 4 = 2;
    name: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED' | 'DELETED' = 'ARCHIVED';
}

export class MetaData {
    title = '';
    startDate = Timestamp.now();
    endDate = Timestamp.now();
    rating: number = 0;
    studentCount: number = 0;
    baseRating: number = 0;
    baseStudentCount: number = 0;
    tag: SelectItem | null = null;
    landingPage: string | null = null;
    bgColor: string | null = null;
    coverImage: Item | null = null;
    coverVideo: Item | null = null;
    creditPoints: number = 0;
    duration: number = 0;

    constructor(title: string) {
        this.title = title;
    }
}

export class Content {
    type = '';
    status = {
        isCompleted: false,
        isLocked: false,
        lockMessage: ''
    };
    item: Item;
    content?: Content[] = [];

    constructor(type: string) {
        this.type = type;
        this.item = new Item(`Title of the ${type}`);
        if(this.type == 'SEGMENT')
        this.content!.push(new Content('VIDEO'));
    }
}

export class Item {
    title = '';
    uri = '';
    embedUrl = '';
    duration = 0;
    constructor(title: string, uri?: string, embedUrl?: string, duration?: number) {
        this.title = title;
        this.uri = uri || '';
        this.embedUrl = embedUrl || '';
        this.duration = duration || 0;
    }
}
