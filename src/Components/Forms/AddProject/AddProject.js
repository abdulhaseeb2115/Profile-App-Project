import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import ValidateImage from "../../ValidateImage/ValidateImage";
import "./AddProject.css";
import { v4 } from "uuid";
import SmallLoader from "../../Loader/SmallLoader";
// firebase imports
import { Timestamp } from "@firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import ConfirmModalBackdrop from "../../ConfirmModal/ConfirmModalBackdrop";



const AddProject = ({ userId, isFeatured, setAddProject }) => {
    const initial = {
        image: "",
        name: "",
        details: "",
        summary: "",
        company: "",
        featured: isFeatured,
    };

    const [confirm, setConfirm] = useState(false);
    const close = () => {
        if (
            image === initial.image &&
            name === initial.name &&
            details === initial.details &&
            summary === initial.summary &&
            company === initial.company &&
            featured === initial.featured
        ) {
            setAddProject(false);
        } else {
            setConfirm(true);
        }
    };




    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [details, setDetails] = useState("");
    const [summary, setSummary] = useState("");
    const [company, setCompany] = useState("");
    const [featured, setFeatured] = useState(isFeatured);

    const addProjectSubmit = async () => {
        if (
            name === "" ||
            image === "" ||
            details === "" ||
            summary === "" ||
            company === "" ||
            featured === ""
        ) {
            alert("*all fields are required");
            return;
        }
        setDisable(true);
        addImageToStorage();
    };

    const addImageToStorage = () => {
        const imageRef = ref(
            storage,
            `project-images/${name.split(" ").join("") + v4()}`
        );
        const uploadTask = uploadBytesResumable(imageRef, image);
        uploadTask.on(
            "state-changed",

            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },

            (error) => {
                // error in image upload
                alert(">>> " + error);
            },

            () => {
                // successful image upload
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    addDocumentToDatabase(downloadURL); //call add document function
                });
            }
        );
    };

    const addDocumentToDatabase = async (imageLink) => {
        const docRef = await addDoc(collection(db, "projects"), {
            name: name,
            image: imageLink,
            details: details,
            summary: summary,
            company: company,
            is_featured: featured,
            created_by: userId,
            gallery: [{}, {}, {}, {}, {}, {}],
            date_created: Timestamp.fromDate(new Date())
        });
        console.log("Document written with ID: ", docRef.id);
        alert("* project added");
        setDisable(false);
        setAddProject(false);
    };


    const [disable, setDisable] = useState(false);

    return (
        <div
            className="AddProject position-absolute top-50 start-50 translate-middle bg-white rounded-4 py-3 ps-5 pe-2 col-10 col-md-8 col-lg-6 d-flex flex-column"
            style={{ height: "90vh", zIndex: "20" }}
        >

            {
                confirm &&
                <>
                    <ConfirmModalBackdrop />
                    <ConfirmModal setShowMainModal={setAddProject} setShowConfirmModal={setConfirm} />
                </>
            }

            <div className="pe-4" style={{ overflow: "auto" }}>

                {/* heading and exit */}
                <div className="container-fluid mg-0 p-0 d-flex justify-content-between align-items-center">
                    <h2 className="fw-bold m-0">Add Project</h2>
                    <AiFillCloseCircle size="30px" onClick={() => close()} />
                </div>

                {/* image */}
                <div
                    className="rounded-4 overflow-hidden mt-2 mx-auto position-relative bg-light d-flex align-items-center justify-content-center border"
                    style={{ width: "10vmax", height: "10vmax" }}
                >
                    {imagePreview === null ? (
                        <h6 className="w-100 text-center p-2">Select project image</h6>
                    ) : (
                        <img
                            src={imagePreview}
                            alt="Image_Preview"
                            style={{ width: "auto", height: "100%" }}
                        />
                    )}

                    <ValidateImage setImagePreview={setImagePreview} setImage={setImage} />
                </div>

                {/* name */}
                <div className="form-group mt-1">
                    <label htmlFor="name" className="small">
                        Project Name
                    </label>
                    <input
                        type="text"
                        className="form-control mt-1 py-1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* summary */}
                <div className="form-group mt-1">
                    <label className="small">Project Summary</label>
                    <textarea
                        className="form-control mt-1 py-1"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                </div>

                {/* details */}
                <div className="form-group mt-1">
                    <label className="small">Project Details</label>
                    <textarea
                        className="form-control mt-1 py-1"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                    />
                </div>

                {/* company */}
                <div className="form-group mt-1">
                    <label className="small">Company</label>
                    <input
                        type="text"
                        className="form-control mt-1 py-1"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
                </div>

                {/* buttons */}
                <div className="container-fluid d-flex mt-5 p-0 m-0">
                    <div className="ms-auto">
                        <input
                            type="checkbox"
                            defaultChecked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                        />
                        <span className="me-3">Featured Project</span>

                        <button
                            onClick={addProjectSubmit}
                            className="btn btn-sm btn-outline-primary px-4 ms-auto"
                            disabled={disable}
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

export default AddProject;
