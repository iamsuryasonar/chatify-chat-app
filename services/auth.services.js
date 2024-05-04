import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

export function githubSignInPopup() {
    return new Promise(function (resolve, reject) {
        const provider = new GithubAuthProvider();
        const auth = getAuth();

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                resolve(result)
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                // ...
                reject(error)
            });
    })
}


export function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}