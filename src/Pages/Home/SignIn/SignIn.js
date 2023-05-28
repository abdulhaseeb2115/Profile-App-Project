import React, { useEffect, useState } from "react";
import { MdAlternateEmail, MdPassword } from "react-icons/md";
import "./SignIn.css";
import Loader from "../../../Components/Loader/Loader";
// react router dom
import { useNavigate } from "react-router-dom";
// imports for authentication
import {
	fetchSignInMethodsForEmail,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import { logIn } from "../../../features/userSlice";
import {
	addDoc,
	collection,
	getDocs,
	limit,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleButton from "react-google-button";

const SignIn = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, loading } = useSelector(selectUser);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// captcha
	const [loginFail, setLoginFail] = useState(0);
	const [captcha, setCaptcha] = useState("");
	function onChange(value) {
		setCaptcha(value);
	}

	// Login User
	const loginUser = () => {
		if (email === "" || password === "") {
			alert("*all fields are required");
			return;
		}
		if (loginFail > 2 && captcha === "") {
			alert("*captcha is required");
			return;
		}

		signInWithEmailAndPassword(auth, email, password)
			.then(
				//user logged in
				(userCredential) => {
					const q = query(
						collection(db, "users"),
						where("user_id", "==", userCredential.user.uid),
						limit(1)
					);
					getDocs(q).then((querySnapshot) => {
						dispatch(
							logIn({
								uid: userCredential.user.uid,
								email: userCredential.user.email,
								name: userCredential.user.displayName,
								dob: querySnapshot.docs[0]
									.data()
									.dob.toDate()
									.toLocaleDateString("en-CA"),
							})
						);
						setLoginFail(0);
						navigate("/profile");
					});
				}
			)
			.catch((error) => {
				alert("*" + error.code.replace(/-/g, " "));
				if (error.code === "auth/wrong-password") {
					setLoginFail(loginFail + 1);
				}
			});
	};

	// Forget Password
	const forgetPassword = () => {
		if (email === "") {
			alert("* Enter email to reset pasword");
			return;
		}

		sendPasswordResetEmail(auth, email)
			.then(() => {
				alert("* Reset email has been sent !");
			})
			.catch((error) => {
				alert("*" + error.code);
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
			.then(async (result) => {
				// fetch user data
				const querySnapshot = await getDocs(
					query(
						collection(db, "users"),
						where("user_id", "==", result.user.uid)
					)
				);
				if (querySnapshot.docs.length > 0) {
					// if user exists
					dispatch(
						logIn({
							uid: result.user.uid,
							email: result.user.email,
							name: result.user.displayName,
							dob: querySnapshot.docs[0].data().dob,
						})
					);
				} else {
					// if user does not exist
					console.log("*user not found");
					addDoc(collection(db, "users"), {
						user_id: result.user.uid,
						name: result.user.displayName,
						dob: "1999-12-12",
						date_created: Timestamp.fromDate(new Date()),
					})
						.then(() => {
							console.log("*new user created");
							dispatch(
								logIn({
									uid: result.user.uid,
									email: result.user.email,
									name: result.user.displayName,
									dob: "1999-12-12",
								})
							);
						})
						.catch((error) => {
							console.log(error);
						});
				}
				navigate("/profile");
			})
			.catch((error) => {
				console.log(error);
			});
		navigate("/profile");
	};

	return loading === true ? (
		<Loader />
	) : (
		<div className="container-fluid">
			<div className="row">
				<div className="col-6 p-0 d-flex align-items-center justify-content-center pt-4 mx-auto">
					<form className="bg-white col-xs-12 col-md-10 py-4 px-5 rounded-3 border">
						<h4 className="pb-2 text-secondary border-bottom">SignIn</h4>

						<div className="form-group d-flex align-items-center mt-5">
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
								placeholder="Enter email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
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

						<div className="col-12 text-center mt-5">
							<button
								type="submit"
								className="btn btn-sm btn-primary px-5"
								onClick={(e) => {
									e.preventDefault();
									loginUser();
								}}
							>
								Sign In
							</button>
						</div>

						<div className="col-12 text-center mt-3">
							<p
								role={"button"}
								className="text-primary text-decoration-underline"
								onClick={() => forgetPassword()}
							>
								forgot password !
							</p>
						</div>

						<div className="col-12 text-center mt-3">
							<p>
								Don't have an account&nbsp;
								<span
									role={"button"}
									className="text-primary text-decoration-underline"
									onClick={() => navigate("/register")}
								>
									sign up
								</span>
							</p>
						</div>

						{loginFail > 2 && (
							<div className="col-12 d-flex justify-content-center">
								<div className="reCaptcha">
									<ReCAPTCHA
										id="captcha2"
										sitekey="6Len4ZMiAAAAAKpPdt6pc871PHUgZJFLe6FCkYEf"
										onChange={onChange}
									/>
								</div>
							</div>
						)}

						<div className="col-12 d-flex justify-content-center mt-3">
							<GoogleButton
								label="SignIn With Google"
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

export default SignIn;
