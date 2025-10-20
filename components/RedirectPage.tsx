import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRedirectUrl } from "../services/api";

const RedirectPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [status, setStatus] = useState<
    "loading" | "found" | "not_found" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (hash) {
      const performRedirect = async () => {
        try {
          const data = await getRedirectUrl(hash);
          if (data && data.redirect_url) {
            setStatus("found");
            window.location.replace(data.redirect_url);
          } else {
            setStatus("not_found");
          }
        } catch (error) {
          setStatus("error");
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
          );
        }
      };
      performRedirect();
    } else {
      setStatus("not_found");
    }
  }, [hash]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <i className="fa-solid fa-spinner fa-spin text-5xl mb-4 text-cyan-500"></i>
            <h1 className="text-3xl font-bold">Redirecting...</h1>
            <p className="text-slate-500">
              Please wait while we find your link.
            </p>
          </>
        );
      case "found":
        return (
          <>
            <i className="fa-solid fa-check-circle text-5xl mb-4 text-green-500"></i>
            <h1 className="text-3xl font-bold">Redirecting...</h1>
            <p className="text-slate-500">
              You are being redirected to your destination.
            </p>
          </>
        );
      case "not_found":
        return (
          <>
            <i className="fa-solid fa-circle-xmark text-5xl mb-4 text-yellow-500"></i>
            <h1 className="text-3xl font-bold">Link Not Found</h1>
            <p className="text-slate-500">
              Sorry, the link you are looking for does not exist or has expired.
            </p>
            <a
              href="/"
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Go to Homepage
            </a>
          </>
        );
      case "error":
        return (
          <>
            <i className="fa-solid fa-triangle-exclamation text-5xl mb-4 text-red-500"></i>
            <h1 className="text-3xl font-bold">An Error Occurred</h1>
            <p className="text-slate-500">{errorMessage}</p>
            <a
              href="/"
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Go to Homepage
            </a>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="text-center p-8 sm:p-10 bg-white rounded-2xl shadow-sm max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default RedirectPage;
