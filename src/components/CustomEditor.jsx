// components/CustomEditor.js
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import http from "../utils/http";

// 🔹 Custom upload adapter
class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }
    // Starts the upload
    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append("image", file);

                    http.post(`editor/upload`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    .then((res) => {
                        const imageUrl = res?.data?.data?.url || res?.data?.url;

                        if (!imageUrl) {
                            reject(new Error(res?.data?.message || "Image upload response missing URL"));
                            return;
                        }

                        resolve({
                            default: imageUrl, // URL returned from server
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    });
                })
        );
    }
    abort() {
        // Reject promise if user cancels
    }
}

function CustomUploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new UploadAdapter(loader);
    };
}

const CustomEditor = ({ value, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            config={{
                extraPlugins: [CustomUploadPlugin],
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default CustomEditor;
