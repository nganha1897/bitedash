export declare class Cloudinary {
    static uploadMedia(path: string, dest_path: string, filename?: string): Promise<{
        public_id: string;
        url: string;
    }>;
    static delete_file(file: string): Promise<boolean>;
}
