import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import "./AddGalleryImage.css";
import { v4 } from "uuid";
// firebase imports
import { db, storage } from "../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
// rich text editor
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import SmallLoader from "../../Loader/SmallLoader";
import ValidateImage from "../../ValidateImage/ValidateImage";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import ConfirmModalBackdrop from "../../ConfirmModal/ConfirmModalBackdrop";



const AddGalleryImage = ({
    index,
    userName,
    oldGallery,
    gallery,
    projectId,
    userId,
    setAddImages,
    setAllowEdit
}) => {

    const x = gallery[index].desc ? EditorState.createWithContent(convertFromRaw(JSON.parse(gallery[index].desc))) : EditorState.createEmpty();
    const [description, setDescription] = useState(x);

    const [image, setImage] = useState(gallery[index].img ? gallery[index].img : "");
    const [imagePreview, setImagePreview] = useState(gallery[index].img ? gallery[index].img : "");

    const addProjectSubmit = async () => {
        addImageToStorage(image);
    };

    const addImageToStorage = async (image) => {
        if (image === gallery[index].img) {
            if (image === "" || typeof image === "undefined") {
                addDocumentToDatabase("");
                return;
            }
            addDocumentToDatabase(image);
            return;
        }

        // delete old image
        if (gallery[index].img) {
            const fileRef = ref(storage, gallery[index].img);
            deleteObject(fileRef).then(() => {
                console.log("old img deleted")
            }).catch((error) => {
                console.log(error)
            })
        }

        // add new image
        const resumeRef = ref(
            storage,
            `project-images/${userName.split(" ").join("") + v4()}`
        );
        const uploadTask = uploadBytesResumable(resumeRef, image);
        uploadTask.on(
            "state-changed",

            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },

            (error) => {
                // error in resume upload
                alert(">>> " + error);
            },

            () => {
                // successful resume upload and add resume link to document
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    addDocumentToDatabase(downloadURL);
                });
            }
        );
    };

    const addDocumentToDatabase = async (imgLink) => {
        const updatedGallery = [...oldGallery];
        updatedGallery[index] = { img: imgLink, desc: JSON.stringify(convertToRaw(description.getCurrentContent())) };

        await updateDoc(doc(db, "projects", projectId), {
            gallery: updatedGallery,
        }).then(() => {
            alert(`* images updated !`);
            setDisable(false);
            setAddImages(false);
            setAllowEdit(false)
        }).catch((error) => {
            alert(error)
            setAddImages(false);
            setAllowEdit(false)
        });
    };

    const [disable, setDisable] = useState(false);




    const initial = {
        image: gallery[index].img ? gallery[index].img : "",
        description: x,
    };

    const [confirm, setConfirm] = useState(false);
    const close = () => {
        if (
            image === initial.image &&
            description === initial.description
        ) {
            setAddImages(false);
            setAllowEdit(false);
        } else {
            setConfirm(true);
        }
    };




    return (

        <div
            className="AddProject position-absolute top-50 start-50 translate-middle bg-white rounded-4 py-3 ps-5 pe-2 col-11 col-md-10 col-lg-9 d-flex flex-column"
            style={{ height: "90vh", zIndex: "20" }}
        >

            {
                confirm &&
                <>
                    <ConfirmModalBackdrop />
                    <ConfirmModal setShowMainModal={setAddImages} setShowConfirmModal={setConfirm} />
                </>
            }

            <div className="h-100 w-100 d-flex flex-column align-items-center overflow-auto pe-5 pb-4">
                {/* heading and exit */}
                <div className="container-fluid mg-0 p-0 d-flex justify-content-between align-items-center">
                    <h2 className="fw-bold m-0">Gallery</h2>
                    <AiFillCloseCircle size="30px" onClick={() => close()} />
                </div>


                {/* image */}
                <div className="col-4 d-flex align-items-center mt-5">
                    <div
                        className="rounded-4 overflow-hidden mx-auto position-relative bg-light d-flex align-items-center justify-content-center border mb-4"
                        style={{ width: "20vmax", height: "20vmax" }}
                    >
                        {imagePreview === "" ? (
                            <h6 className="w-100 text-center p-2">Select image {index + 1}</h6>
                        ) : (
                            <img
                                src={imagePreview}
                                alt="Image_Preview"
                                style={{ width: "auto", height: "100%" }}
                            />
                        )}

                        <ValidateImage
                            setImagePreview={setImagePreview}
                            setImage={setImage}
                        />
                    </div>
                </div>


                {/* editor */}
                <div className="col-7 border p-2 overflow-auto mb-auto">
                    <Editor
                        editorState={description}
                        placeholder='Type here or press ctrl + V to paste your content'
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName bg-light px-2"
                        onEditorStateChange={(editorState) => {
                            setDescription(editorState);
                        }}

                        toolbar={{
                            options: ["inline", "list", "textAlign", "history"],
                        }}
                    />
                </div>


                {/* buttons */}
                <div className="container-fluid d-flex mb-5 p-0 m-0">
                    <div className="ms-auto">
                        <button
                            onClick={addProjectSubmit}
                            className="btn btn-sm btn-outline-primary px-4 ms-auto"
                        >
                            {
                                disable === true ?
                                    <SmallLoader />
                                    :
                                    "save"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGalleryImage;
