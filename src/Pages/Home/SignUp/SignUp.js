import React, { useEffect, useState } from "react";
import { FaBirthdayCake } from "react-icons/fa";
import { MdAlternateEmail, MdPassword } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import "./SignUp.css";
import Loader from "../../../Components/Loader/Loader";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleButton from "react-google-button";

// imports for authentication
import { Timestamp } from "@firebase/firestore";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../../features/userSlice";
import { addDoc, collection } from "firebase/firestore";
// react router dom
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { selectUser } from "../../../features/userSlice";

const SignUp = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, loading } = useSelector(selectUser);

	// captcha
	const [captcha, setCaptcha] = useState("");
	function onChange(value) {
		setCaptcha(value);
	}

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [dob, setDob] = useState("");
	const [password, setPassword] = useState("");
	const [agree, setAgree] = useState(false);

	// Register new user
	const registerUser = () => {
		if (
			name === "" ||
			email === "" ||
			password === "" ||
			dob === "" ||
			agree === false
		) {
			alert("*all fields are required");
			return;
		}
		if (captcha === "") {
			alert("*captcha is required");
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then(
				//user created
				(userCredential) => {
					updateProfile(auth.currentUser, {
						displayName: name,
					})
						.then(
							//name updated
							() => {
								addDoc(collection(db, "users"), {
									user_id: userCredential.user.uid,
									dob: dob,
									name: name,
									date_created: Timestamp.fromDate(new Date()),
								});
							}
						)
						.then(async () => {
							await sendEmailVerification(auth.currentUser)
								.then(() => {
									alert(`*verification email has been sent to ${email}!`);
									//user added to collection
									dispatch(
										logIn({
											uid: userCredential.user.uid,
											email: userCredential.user.email,
											name: userCredential.user.displayName,
											dob: dob,
										})
									);
									navigate("/profile");
								})
								.catch((error) => {
									console.log(error);
								});
						});
				}
			)
			.catch((error) => {
				alert("*" + error.code.replace(/-/g, " "));
			});
	};

	useEffect(() => {
		if (loading === false) {
			if (user !== null) {
				navigate("/profile");
			}
		}
	}, [user, loading]);

	const provider = new GoogleAuthProvider();
	const signInwithGoogle = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				addDoc(collection(db, "users"), {
					user_id: result.user.uid,
					name: result.user.displayName,
					dob: "1999-12-12",
					date_created: Timestamp.fromDate(new Date()),
				})
					.then(() => {
						dispatch(
							logIn({
								uid: result.user.uid,
								email: result.user.email,
								name: result.user.displayName,
								dob: "1999-12-12",
							})
						);
						navigate("/profile");
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return loading === true ? (
		<Loader />
	) : (
		<div className="container-fluid">
			<div className="row">
				<div className="col-6 p-0 d-flex align-items-center justify-content-center pt-4 mx-auto">
					<form className="bg-white col-xs-12 col-md-8 py-4 px-5 rounded-3 border">
						<h4 className="pb-2 text-secondary border-bottom">Signup</h4>

						<div className="form-group d-flex align-items-center mt-5">
							<label
								htmlFor="name"
								className="me-2 border-dark"
								style={{ borderBottom: "2px solid" }}
							>
								<BsFillPersonFill />
							</label>
							<input
								type="text"
								className="form-control rounded-1"
								id="name"
								placeholder="Your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div className="form-group d-flex align-items-center mt-4">
							<label
								htmlFor="email"
								className="me-2 border-dark"
								style={{ borderBottom: "2px solid" }}
							>
								<MdAlternateEmail />
							</label>
							<input
								type="email"
								className="form-control rounded-1"
								id="email"
								placeholder="Enter email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="form-group d-flex align-items-center mt-4">
							<label
								htmlFor="dob"
								className="me-2 border-dark rounded-1"
								style={{ borderBottom: "2px solid" }}
							>
								<FaBirthdayCake />
							</label>
							<input
								type="date"
								className="form-control rounded-1"
								value={dob}
								onChange={(e) => setDob(e.target.value)}
							/>
						</div>

						<div className="form-group d-flex align-items-center mt-4">
							<label
								htmlFor="password"
								className="me-2 border-dark"
								style={{ borderBottom: "2px solid" }}
							>
								<MdPassword />
							</label>
							<input
								type="password"
								className="form-control rounded-1"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<div className="form-check d-flex justify-content-center mt-4 mb-3">
							<input
								className="form-check-input me-2"
								type="checkbox"
								onClick={(e) => {
									setAgree(e.target.checked);
								}}
							/>
							<label className="form-check-label" htmlFor="terms">
								I agree all statements in{" "}
								<span
									className="text-decoration-underline text-primary"
									onClick={() => navigate("/policy")}
								>
									Privacy policy
								</span>{" "}
								and{" "}
								<span
									className="text-decoration-underline text-primary"
									onClick={() => navigate("/terms")}
								>
									terms
								</span>
							</label>
						</div>

						<div className="col-12 text-center">
							<button
								type="submit"
								className="btn btn-sm btn-primary px-5"
								onClick={(e) => {
									e.preventDefault();
									registerUser();
								}}
							>
								Sign Up
							</button>
						</div>

						<div className="col-12 text-center mt-3">
							<p>
								Already have an account&nbsp;
								<span
									role={"button"}
									className="text-primary text-decoration-underline"
									onClick={() => navigate("/")}
								>
									sign in
								</span>
							</p>
						</div>

						<div className="col-12 d-flex justify-content-center">
							<div className="reCaptcha">
								<ReCAPTCHA
									id="captcha1"
									sitekey="6Len4ZMiAAAAAKpPdt6pc871PHUgZJFLe6FCkYEf"
									onChange={onChange}
								/>
							</div>
						</div>

						<div className="col-12 d-flex justify-content-center mt-3">
							<GoogleButton
								label="Signup With Google"
								onClick={() => signInwithGoogle()}
							/>
						</div>
					</form>
				</div>

				<div className="col-6 p-0 text-center border-start d-none">
					<img
						src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Z4bccQ8iIFFWK447MnZ9lrOFAX6KZYgsU1qKnfDedg9LFgBM_-hydfTc7j8OA3LM9EI&usqp=CAU"
						alt="homepage_image"
						height={"auto"}
						width={"100%"}
					/>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
