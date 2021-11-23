import { addDoc, collection, doc } from "@firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Circle from "../components/circle/Circle";
import MapCard from "../components/MapCard";
import Navbar from "../components/Navbar";
import { auth, firestore } from "../firebase";

function Home(props) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);

    const [mapData, dataLoading, dataError] = useCollectionData(
        collection(firestore, `users/${user?.uid}/maps`),
        { idField: "mapID" }
    );
    console.log(mapData);

    //   const onSubmit = data => console.log(data);
    function onSubmit(data) {
        if (!user) return;
        let mapData = {
            name: data.name,
            description: data.description,
            owner: user.uid,
            creationTimestamp: new Date(),
            lastEditTimestamp: new Date(),
            public: false,
            circles: [],
            connections: [],
        };

        addDoc(collection(firestore, `/users/${user.uid}/maps`), mapData).then(
            function (result) {
                let docID = result.id;
                navigate(`/map/${user.uid}/${docID}`);
            }
        );

        console.log(data);
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="home-cards">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* register your input into the hook by invoking the "register" function */}
                    <div className="card light-shadow">
                        <h1 className="map-card-name">Create a Map</h1>
                        <input
                            className="input create-map-input"
                            placeholder="Map name..."
                            {...register("name", { required: true })}
                        />
                        {errors.name && (
                            <p className="form-error">This field is required</p>
                        )}
                        <input
                            className="input create-map-input"
                            placeholder="Map description..."
                            {...register("description")}
                        />

                        <button
                            type="submit"
                            className="light-shadow primary-button"
                        >
                            Create
                        </button>
                    </div>
                </form>
                {mapData?.map((doc) => {
                    return <MapCard data={doc} uid={user?.uid} />;
                })}
            </div>
        </>
    );
}

export default Home;
