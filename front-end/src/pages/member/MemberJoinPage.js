import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import md5 from "md5";
import * as yup from "yup";

const passwordValidationSchema = yup
  .string()
  .required()
  .min(8)
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/,
    "Password must contain at least one upper case letter, one lower case letter, and one digit"
  );

const MemberJoinPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/group", {
      method: "GET",
      headers: {
        Token: searchParams.get("token"),
      },
    }).then((res) => {
      if (res.status >= 400 && res.status < 500) {
        setError("Access to group denied-------------------");
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        res.json().then((body) => setEmail(body.email));
      }
    });
  }, []);

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const encryptWithPassword = (password, privateKey) => {
    return window.crypto.subtle
      .importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
        "deriveKey",
      ])
      .then((baseKey) => {
        return window.crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: new Uint8Array(16), // You can generate a salt here if needed
            iterations: 100000, // Number of iterations (adjust as needed)
            hash: "SHA-256",
          },
          baseKey,
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt"]
        );
      })
      .then((derivedKey) => {
        // Encrypt the array using AES-GCM
        window.crypto.subtle
          .encrypt(
            {
              name: "AES-GCM",
              iv: iv,
              tagLength: 128,
            },
            derivedKey,
            privateKey
          )
          .then((encryptedDataBuffer) => {
            return new TextDecoder("utf-8").decode(encryptedDataBuffer);
          });
      });
  };

  const getKeys = () => {
    const algorithm = {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
      hash: { name: "SHA-256" },
    };

    return window.crypto.subtle
      .generateKey(
        algorithm,
        true, // whether the key is extractable (i.e., can be exported)
        ["encrypt", "decrypt"] // key usages
      )
      .then((keyPair) => {
        return Promise.all([
          window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey),
          window.crypto.subtle.exportKey("spki", keyPair.publicKey),
        ]);
      })
      .then(([exportedPrivateKey, exportedPublicKey]) => {
        console.log(exportedPrivateKey, exportedPublicKey);
        return [exportedPrivateKey, arrayBufferToBase64(exportedPublicKey)];
      });
  };

  const handleJoin = () => {
    passwordValidationSchema
      .validate(password)
      .then(() => getKeys())
      .then(([privateKey, publicKey]) => {
        fetch("/api/join", {
          method: "POST",
          body: JSON.stringify({
            nickname,
            password: md5(password),
            encPrivateKey: privateKey,
            publicKey: publicKey,
          }),
          headers: {
            "Content-Type": "application/json",
            Token: searchParams.get("token"),
          },
        }).then((res) => {
          if (res.status === 401) {
            setError("Access to group denied");
            return;
          }
          if (res.status >= 400 && res.status < 500) {
            res.json().then((body) => setError(body.message));
            return;
          }
          if (res.status >= 200 && res.status < 300) {
            navigate("/member/home");
            return;
          }
        });
      })
      .catch((error) => {
        console.error("Error generating key pair:", error);
      });
  };

  return (
    <div>
      <h2>Join group by {email}</h2>
      <div>Please provide these details:</div>
      <div>Nickname:</div>
      <input
        type="text"
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
      />
      <div>Password:</div>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <div>{error ? error : ""}</div>
      <div>
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
};

export default MemberJoinPage;
