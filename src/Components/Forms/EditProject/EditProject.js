import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import "./EditProject.css";
import ValidateImage from "../../ValidateImage/ValidateImage";
import { v4 } from "uuid";

// firebase imports
import { Timestamp } from "@firebase/firestore";
import { db, storage } from "../../../firebaseConfig";
import { deleteObject, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
    getDoc, doc, updateDoc, collection,
    getDocs,
    query,
    where,
    deleteDoc,
    writeBatch,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import SmallLoader from "../../Loader/SmallLoader";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import ConfirmModalBackdrop from "../../ConfirmModal/ConfirmModalBackdrop";



const EditProject = ({ userId, project, setEditProject }) => {
    const initial = {
        image: project.image,
        name: project.name,
        details: project.details,
        summary: project.summary,
        company: project.company,
        featured: project.is_featured,
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
            setEditProject(false);
        } else {
            setConfirm(true);
        }
    };


    const [imagePreview, setImagePreview] = useState(project.image);
    const [image, setImage] = useState(project.image);
    const [name, setName] = useState(project.name);
    const [details, setDetails] = useState(project.details);
    const [summary, setSummary] = useState(project.summary);
    const [company, setCompany] = useState(project.company);
    const [featured, setFeatured] = useState(project.is_featured);

    const navigate = useNavigate();

    // Delete Post
    const deleteProjectSubmit = async () => {
        setDisable(true);

        try {
            const querySnapshot2 = await getDoc(doc(db, "projects", project.docId));
            if (querySnapshot2.data().image !== "") {
                await deleteObject(ref(storage, querySnapshot2.data().image));
            }
            //delete post
            await deleteDoc(doc(db, "projects", project.docId));
            alert("* project deleted !")
            setDisable(false);
            setEditProject(false);
        } catch (error) {
            console.log(error.code);
        }

    };

    const updateProjectSubmit = async () => {
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
        if (image === project.image) {
            addDocumentToDatabase(image); //call add document function
            return;
        }

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
        await updateDoc(doc(db, "projects", project.docId), {
            name: name,
            image: imageLink,
            details: details,
            summary: summary,
            company: company,
            is_featured: featured,
            created_by: userId,
            date_created: Timestamp.fromDate(new Date())
        }).then(() => {
            alert("* project updated !");
            setDisable(false);
            setEditProject(false);
        }).catch((error) => {
            alert(error.code);
        });
    };

    const [disable, setDisable] = useState(false);

    return (
        <div
            className="EditProject position-absolute top-50 start-50 translate-middle bg-white rounded-4 py-3 ps-5 pe-2 col-10 col-md-8 col-lg-6 d-flex flex-column"
            style={{ height: "90vh", zIndex: "20" }}
        >

            {
                confirm &&
                <>
                    <ConfirmModalBackdrop />
                    <ConfirmModal setShowMainModal={setEditProject} setShowConfirmModal={setConfirm} />
                </>
            }

            <div className="pe-4" style={{ overflow: "auto" }}>

                {/* heading and exit */}
                <div className="container-fluid mg-0 p-0 d-flex justify-content-between align-items-center">
                    <h2 className="fw-bold m-0">Edit Project</h2>
                    <AiFillCloseCircle
                        size="30px"
                        onClick={() => close()}
                    />
                </div>

                {/* image */}
                <div
                    className="rounded-4 overflow-hidden mt-2 mx-auto position-relative d-flex align-items-center justify-content-center"
                    style={{ width: "10vmax", height: "10vmax" }}
                >
                    <img
                        src={imagePreview}
                        alt="Image_Preview"
                        style={{ width: "auto", height: "100%" }}
                    />
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
                    <button
                        onClick={deleteProjectSubmit}
                        className="btn btn-sm btn-outline-danger px-4"
                        disabled={disable}
                    >
                        {
                            disable === true ?
                                <SmallLoader />
                                :
                                "delete"
                        }
                    </button>

                    <div className="ms-auto">
                        <input
                            type="checkbox"
                            defaultChecked={project.is_featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                        />
                        <span className="me-3">Featured Project</span>

                        <button
                            onClick={updateProjectSubmit}
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

export default EditProject;
