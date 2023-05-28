import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import ValidateImage from "../../ValidateImage/ValidateImage";
import "./EditProfile.css";
import { v4 } from "uuid";

// firebase imports
import { auth, db, storage } from "../../../firebaseConfig";
import { updateEmail, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SmallLoader from "../../Loader/SmallLoader";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import ConfirmModalBackdrop from "../../ConfirmModal/ConfirmModalBackdrop";

const EditProfile = ({
    user,
    setNameMain,
    setImageMain,
    setDescriptionMain,
    setEditProfile,
}) => {
    const initial = {
        image: user.image,
        name: user.name,
        description: user.description,
        email: user.email,
        phone: user.phone,
        linkedIn: user.linkedIn,
    };

    const [confirm, setConfirm] = useState(false);
    const close = () => {
        if (
            image === initial.image &&
            name === initial.name &&
            description === initial.description &&
            email === initial.email &&
            phone === initial.phone &&
            linkedIn === initial.linkedIn
        ) {
            setEditProfile(false);
        } else {
            setConfirm(true);
        }
    };

    const [imagePreview, setImagePreview] = useState(user.image);
    const [image, setImage] = useState(user.image);
    const [name, setName] = useState(user.name);
    const [description, setDescription] = useState(user.description);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [linkedIn, setLinkedin] = useState(user.linkedIn);

    // update user data
    const updateProfileSubmit = async () => {
        if (
            name === "" ||
            image === "" ||
            email === "" ||
            description === "" ||
            phone === "" ||
            linkedIn === ""
        ) {
            alert("*all fields are required");
            return;
        }
        setDisable(true);
        addImageToStorage();
    };

    const addImageToStorage = () => {
        if (image === user.image) {
            if (image === "" || typeof image === "undefined") {
                addDocumentToDatabase(" ");
                return;
            }
            addDocumentToDatabase(image);
            return;
        }
        const imageRef = ref(
            storage,
            `profile-images/${name.split(" ").join("") + v4()}`
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

        console.log(auth.currentUser)
        // username
        await updateProfile(auth.currentUser, { displayName: name }).then(
            async () => {
                console.log("name updated")
                await updateDoc(doc(db, "users", user.docId), {
                    image: imageLink || "",
                    name: name || "",
                    email: email || "",
                    description: description || "",
                    phone: phone || "",
                    linkedIn: linkedIn || "",
                }).then(() => {
                    alert("* profile updated !");
                    setDisable(false);
                    // setNameMain(name);
                    // setImageMain(imagePreview);
                    // setDescriptionMain(description);
                    setEditProfile(false);
                });
            }).catch((error) => {
                alert(error);
            })
    };

    const [disable, setDisable] = useState(false);

    return (
        <div
            className="EditProfile position-absolute top-50 start-50 translate-middle bg-white rounded-4 py-3 ps-5 pe-2 col-10 col-md-8 col-lg-6 d-flex flex-column"
            style={{ height: "90vh", zIndex: "20" }}
        >
            {
                confirm &&
                <>
                    <ConfirmModalBackdrop />
                    <ConfirmModal setShowMainModal={setEditProfile} setShowConfirmModal={setConfirm} />
                </>
            }

            <div className="pe-4" style={{ overflow: "auto" }}>
                {/* heading and exit */}
                <div className="container-fluid mg-0 p-0 d-flex justify-content-between align-items-center">
                    <h2 className="fw-bold m-0">Edit Profile</h2>
                    <AiFillCloseCircle size="30px" onClick={() => close()} />
                </div>

                {/* image */}
                <div
                    className="rounded-circle overflow-hidden mt-2 mx-auto position-relative d-flex align-items-center justify-content-center bg-light"
                    style={{ width: "10vmax", height: "10vmax" }}
                >
                    <img
                        src={imagePreview ? imagePreview : "profile.png"}
                        alt="Image_Preview"
                        style={{ width: "auto", height: "100%" }}
                    />
                    <ValidateImage
                        setImagePreview={setImagePreview}
                        setImage={setImage}
                    />
                </div>

                {/* profile details */}
                <h5 className="mt-2">Profile Details</h5>

                {/* name */}
                <div className="form-group mt-1">
                    <label htmlFor="name" className="small">
                        Display Name
                    </label>
                    <input
                        type="text"
                        className="form-control mt-1 py-1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {/* description */}
                <div className="form-group mt-1">
                    <label className="small">Description</label>
                    <textarea
                        className="form-control mt-1 py-1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* contact information */}
                <h5 className="mt-5">Contact Information</h5>

                {/* email */}
                <div className="form-group mt-1">
                    <label htmlFor="name" className="small">
                        Email
                    </label>
                    <input
                        type="Email"
                        className="form-control mt-1 py-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {/* phone */}
                <div className="form-group mt-1">
                    <label className="small">Phone</label>
                    <input
                        // onKeyPress={(event) => {
                        //     if (!/[0-9]/.test(event.key)) {
                        //         event.preventDefault();
                        //     }
                        // }}
                        type="text"
                        className="form-control mt-1 py-1"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                {/* linkedIn */}
                <div className="form-group mt-1">
                    <label className="small">LinkedIn</label>
                    <input
                        type="text"
                        className="form-control mt-1 py-1"
                        value={linkedIn}
                        onChange={(e) => setLinkedin(e.target.value)}
                    />
                </div>

                {/* save button */}
                <div className="container-fluid mt-5 p-0 m-0 text-end">
                    <button
                        onClick={updateProfileSubmit}
                        className="btn btn-sm btn-outline-primary px-4"
                        disabled={disable}
                    >
                        {disable === true ? <SmallLoader /> : "save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
