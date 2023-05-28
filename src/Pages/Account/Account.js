import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

// firebase imports
import { auth, db, storage } from "../../firebaseConfig";
import { sendEmailVerification, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { logIn, selectUser } from "../../features/userSlice";
import Loader from "../../Components/Loader/Loader";
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

// imports for authentication
import SmallLoader from "../../Components/Loader/SmallLoader";



const Account = () => {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    const { user, loading } = useSelector(selectUser);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resume, setResume] = useState("");
    const [disable, setDisable] = useState(false);

    // update user data
    const updateProfileSubmit = async () => {
        if (name === "" || dob === "" || email === "" || password === "" || confirmPassword === "") {
            alert("*all fields are required");
            return;
        }
        if (password !== confirmPassword) {
            alert("*passwords don't match");
            return;
        }
        setDisable(true);

        // username
        await updateProfile(auth.currentUser, { displayName: name }).then(
            async () => {
                console.log("*name updated")
                await updateEmail(auth.currentUser, email)
                    .then(async () => {
                        console.log("*email updated")
                        // email
                        const q = query
                            (
                                collection(db, "users"),
                                where("user_id", "==", user.uid),
                                limit(1)
                            )

                        // user data
                        await updateDoc(doc(db, "users", (await getDocs(q)).docs[0].id), {
                            email: email,
                            name: name,
                            dob: dob,
                        }).then(async () => {
                            console.log("*data updated")
                            // password
                            await updatePassword(auth.currentUser, password)
                                .then(() => {
                                    console.log("*password updated")
                                    dispatch(
                                        logIn({
                                            uid: user.uid,
                                            email: user.email,
                                            name: user.name,
                                            dob: dob,
                                        })
                                    );
                                }).catch((error) => {
                                    alert(error.code)
                                })
                            alert("* profile updated !");
                            setDisable(false);
                        });
                    })
                    .catch((error) => {
                        alert(error.message);
                    });
            }
        );
    };

    // Verify Email
    const verifyEmail = async () => {
        if (email === "") {
            alert("* Enter email to get verification link");
            return;
        }

        await sendEmailVerification(auth.currentUser)
            .then(() => {
                alert(`*verification email has been sent to ${email}!`)
            }).catch((error) => {
                console.log(error)
            })
    };

    // upload resume
    const uploadResume = async () => {
        // fetch user data
        const querySnapshot = await getDocs(
            query(
                collection(db, "users"),
                where("user_id", "==", user.uid)
            )
        );

        if (querySnapshot.docs[0].data().resume) {
            const fileRef = ref(storage, querySnapshot.docs[0].data().resume);
            deleteObject(fileRef).then(() => {
                console.log("deleted old resume file")
            }).catch((error) => {
                console.log(error)
            })
        }

        const resumeRef = ref(
            storage,
            `user-resume/${name.split(" ").join("") + "Resume" + v4()}`
        );
        const uploadTask = uploadBytesResumable(resumeRef, resume);
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
                    const q = query
                        (
                            collection(db, "users"),
                            where("user_id", "==", user.uid),
                            limit(1)
                        )

                    // user data
                    await updateDoc(doc(db, "users", (await getDocs(q)).docs[0].id), {
                        resume: downloadURL,
                    }).then(() => {
                        alert("* resume updated !");
                    });

                });
            }
        );

    }

    useEffect(() => {
        if (loading === false) {
            if (user === null) {
                navigate("/");
            } else {
                setName(auth.currentUser.displayName);
                setEmail(auth.currentUser.email);
                setDob(user.dob);
            }
        }
    }, [user, loading, navigate]);


    return (
        loading === true ?
            <Loader />
            :
            <div className="EditProfile bg-white rounded-4 my-5 mx-auto py-3 ps-3 pe-1 ps-md-5 pe-md-2 col-11 col-md-8 col-lg-6 d-flex flex-column">
                <div className="pe-4" style={{ overflow: "auto" }}>
                    {/* heading and exit */}
                    <h2 className="fw-bold m-0 mb-5">Account</h2>

                    {/* name */}
                    <div className="form-group my-3">
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

                    {/* dob */}
                    <div className="form-group my-3">
                        <label htmlFor="dob" className="small">
                            DOB
                        </label>
                        <input
                            type="date"
                            className="form-control mt-1 py-1"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </div>

                    {/* password */}
                    <div className="form-group my-3">
                        <label htmlFor="password" className="small">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control mt-1 py-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* confirm password */}
                    <div className="form-group my-3">
                        <label htmlFor="confirmPassword" className="small">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="form-control mt-1 py-1"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {/* email */}
                    <div className="form-group my-3">
                        <label htmlFor="name" className="small">
                            Email
                        </label>
                        <div className="position-relative">
                            <input
                                type="Email"
                                className="form-control mt-1 py-1 pe-5"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <button
                                onClick={() => verifyEmail()}
                                className="position-absolute w-25 h-100 top-0 end-0 btn btn-sm btn-primary px-0"
                            >
                                verify <span className="d-none d-md-inline-block">email</span>
                            </button>
                        </div>
                    </div>

                    {/* save button */}
                    <div className="container-fluid mt-3 mb-3 px-5 m-0 text-center">
                        <button
                            onClick={updateProfileSubmit}
                            className="btn btn-sm btn-outline-primary px-4"
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

                    {/* resume */}
                    <div className="form-group my-3">
                        <label htmlFor="name" className="small">
                            Resume
                        </label>
                        <div className="position-relative">
                            <input
                                type="file"
                                className="form-control mt-1 py-1 pe-5"
                                onChange={(e) => setResume(e.target.files[0])}
                                multiple={false}
                                accept=".pdf, .doc"
                            />

                            <button
                                onClick={() => uploadResume()}
                                className="position-absolute w-25 h-100 top-0 end-0 btn btn-sm btn-primary px-0"
                            >
                                upload
                            </button>
                        </div>
                    </div>

                </div>
            </div>
    )
};

export default Account;
