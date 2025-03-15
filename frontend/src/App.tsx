import { useEffect, useRef, useState } from "react";

const App = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localSdpOfferRef = useRef<HTMLTextAreaElement>(null); // ref for the local sdp offer
    const localSdpAnswerRef = useRef<HTMLTextAreaElement>(null); // ref for the local sdp answer

    const remoteSdpOfferRef = useRef<HTMLTextAreaElement>(null); // for the remote sdp offer
    const remoteSdpAnswerRef = useRef<HTMLTextAreaElement>(null); // for the remote sdp answer

    const localIceCandidates = useRef<HTMLTextAreaElement>(null);
    const remoteIceCandidates = useRef<HTMLTextAreaElement>(null);

    const [localIce, setLocalIce] = useState<RTCIceCandidate[]>([]);
    // const [remoteIce, setRemoteIce] = useState();

    const [peerConnection, setPeerConnection] =
        useState<RTCPeerConnection | null>(null);

    const handleLocalSdpOffer = () => {
        // Generate a SDP offer and set it to the localSdpOfferRef input field's value
        peerConnection?.createOffer().then((offer) => {
            peerConnection.setLocalDescription(offer);

            localSdpOfferRef.current!.value = JSON.stringify(offer);
        });
    };

    const handleLocalSdpAnswer = () => {
        // Generate a SDP answer and set it to the localSdpAnswerRef input field's value
        peerConnection?.createAnswer().then((answer) => {
            peerConnection.setLocalDescription(answer);

            localSdpAnswerRef.current!.value = JSON.stringify(answer);
        });
    };

    const handleRemoteSdpOffer = () => {
        // When the user clicks on the add sdp offer button the input value should be set to the remoteDescription
        const remoteDescription = JSON.parse(remoteSdpOfferRef.current!.value);
        peerConnection?.setRemoteDescription(
            new RTCSessionDescription(remoteDescription)
        );

        remoteSdpOfferRef.current!.value = "";
    };

    const handleRemoteSdpAnswer = () => {
        // When the user clicks on the add sdp answer button the input value should be set to the remoteDescription
        const remoteDescription = JSON.parse(remoteSdpAnswerRef.current!.value);
        peerConnection?.setRemoteDescription(
            new RTCSessionDescription(remoteDescription)
        );

        remoteSdpAnswerRef.current!.value = "";
    };

    const handleLocalIce = () => {
        localIceCandidates.current?.classList.add("blur-xs");
        const localIceJsonType = JSON.stringify(localIce);
        localIceCandidates.current!.value = localIceJsonType;
    };

    const handleRemoteIce = () => {
        const remoteIceJsonType = remoteIceCandidates.current!.value;
        const remoteIceOriginal: RTCIceCandidate[] =
            JSON.parse(remoteIceJsonType);
        remoteIceOriginal.forEach((ic) => {
            peerConnection?.addIceCandidate(ic);
        });

        remoteIceCandidates.current!.value = "";
    };

    useEffect(() => {
        const pc = new RTCPeerConnection({
            iceServers: [], // No STUN/TURN server while using localhost
        });
        setPeerConnection(pc);

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                // Set all these ice to the local ice state
                setLocalIce((pre) => [...pre, e.candidate!]);
            }
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === "connected") {
                alert(`Connected Successfully`);
            }
        };

        pc.onsignalingstatechange = () => {
            console.log("Signaling State: ", pc.signalingState);
        };

        pc.ontrack = (e) => {
            // Whenever we receive the media track from the remote peer this event will be triggered
            console.log("Remote Track Received Line 75: ", e.streams[0]);
            const remoteMediaStream = e.streams[0];

            remoteVideoRef.current!.srcObject = remoteMediaStream;
        };

        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: {
                    frameRate: {
                        ideal: 30,
                        max: 60,
                    },
                    facingMode: "user",
                    // aspectRatio: 16/9
                    width: {
                        exact: 448,
                    },
                    height: {
                        exact: 448,
                    },
                },
            })
            .then((stream: MediaStream) => {
                // console.log(stream);
                localVideoRef.current!.srcObject = stream;

                // Add all the track to the peer connection
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream);
                });
            });

        return () => {
            pc.close();
            setPeerConnection(null);
        };
    }, []);

    return (
        <div className="max-w-full min-h-screen flex flex-col gap-2">
            {/* Video Display Section */}
            <section className="flex gap-2 w-full justify-center py-3">
                <div className="flex flex-col gap-1 items-center">
                    <video
                        autoPlay
                        ref={localVideoRef}
                        className="border-4 border-green-500 aspect-square w-md -scale-x-100"
                    ></video>
                    <span>(Local Video Stream)</span>
                </div>

                <div className="flex flex-col gap-1 items-center">
                    <video
                        autoPlay
                        ref={remoteVideoRef}
                        className="border-4 border-green-500 aspect-square w-md -scale-x-100"
                    ></video>
                    <span>(Remote Video Stream)</span>
                </div>
            </section>

            <hr className="mx-4 bg-black mt-4" />

            {/* SDP Offer Creation Section */}
            <section className="p-4 flex flex-col gap-2">
                <p className="bg-yellow-200 px-4 py-8">
                    <b>Session Description Protocol:</b> This is a Protocol
                    which is used to establish a connection between two peers.
                    It is used to describe the media capabilities of the peers
                    and the supported media codec of the peer and some othe
                    information essential for establishing a connection. There
                    is a type associated with the SDP object which can be of
                    type offer or answer. Offer is the one who is initiating the
                    connection and the answer is the one who is accepting the
                    connection. So we will create <b>SDP offer</b> for the first
                    client and <b>SDP answer</b> for the second client
                </p>

                <div className="flex flex-col items-start gap-2">
                    <textarea
                        ref={localSdpOfferRef}
                        placeholder="Click to generate SDP offer"
                        className="border-2 border-black p-2 w-full h-40"
                    />
                    <button
                        className="bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-50 active:scale-95 transition-all duration-100 ease-in-out hover:cursor-pointer"
                        onClick={handleLocalSdpOffer}
                    >
                        Generate SDP Offer
                    </button>
                </div>
            </section>

            <hr className="mx-4 bg-black mt-4" />

            {/* SDP Answer Creating Section */}
            <section className="p-4 flex flex-col gap-2">
                <div className="flex flex-col items-start gap-2">
                    <textarea
                        ref={localSdpAnswerRef}
                        placeholder="Click to generate SDP answer"
                        className="border-2 border-black p-2 w-full h-40"
                    />
                    <button
                        className="bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-50 active:scale-95 transition-all duration-100 ease-in-out hover:cursor-pointer"
                        onClick={handleLocalSdpAnswer}
                    >
                        Generate SDP Answer
                    </button>
                </div>
            </section>

            <hr className="mx-4 bg-black mt-4" />

            {/* Add the remote SDP from both the peers */}
            <section className="p-4 flex flex-col gap-2">
                <p className="bg-yellow-200 px-4 py-8">
                    Adding the remote SDP to the local peer and vice versa. This
                    is the SDP which will be generated on the remote peer which
                    we will copy in this scenario and add it to the remote
                    description, usually it is done with the help of a signaling
                    server through which the SDPs will be signaled to the other
                    peer of connection and then that peer will add that SDP to
                    its remote description.
                </p>
                <div className="flex flex-col items-start gap-2">
                    <textarea
                        ref={remoteSdpOfferRef}
                        placeholder="Click to add SDP offer"
                        className="border-2 border-black p-2 w-full h-40"
                    />
                    <button
                        className="bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-50 active:scale-95 transition-all duration-100 ease-in-out hover:cursor-pointer"
                        onClick={handleRemoteSdpOffer}
                    >
                        Add SDP Offer
                    </button>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <textarea
                        ref={remoteSdpAnswerRef}
                        placeholder="Click to add SDP answer"
                        className="border-2 border-black p-2 w-full h-40"
                    />
                    <button
                        className="bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-50 active:scale-95 transition-all duration-100 ease-in-out hover:cursor-pointer"
                        onClick={handleRemoteSdpAnswer}
                    >
                        Add SDP Answer
                    </button>
                </div>
            </section>

            <hr className="mx-4 bg-black mt-4" />

            {/* Ice candidates section */}
            <section className="p-4 flex flex-col gap-2">
                <p className="bg-yellow-200 px-4 py-8">
                    <b>
                        ICE (Interactivity Connectivity Establishment)
                        Candidates:
                    </b>{" "}
                    This is a protocol which is used by the WebRTC in order to
                    get the public information about the peer like the{" "}
                    <b>public IP address</b> at which the peer is accessible and
                    some other information. Generally we will use a STUN or TURN
                    if you are unlucky for generating these Ice Candidates but
                    in this canse we are using <b>localhost</b> due to which we
                    do not need a STUN/TURN server.
                </p>

                <div className="flex flex-col items-start gap-2">
                    <div className="w-full border-2 border-black flex items-center">
                        <textarea
                            ref={localIceCandidates}
                            // placeholder="Local peer ICE candidates"
                            className="p-2 w-full h-40 outline-none"
                        />
                    </div>
                    <button
                        className="bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-50 active:scale-95 transition-all duration-100 ease-in-out hover:cursor-pointer"
                        onClick={handleLocalIce}
                    >
                        Click to generate ICE candidates
                    </button>
                </div>

                <div className="flex flex-col items-start gap-2">
                    <div className="w-full border-2 border-black flex items-center">
                        <textarea
                            ref={remoteIceCandidates}
                            // placeholder="Remote peer ICE candidates"
                            className="p-2 w-full h-40 blur-xs outline-none"
                        />
                    </div>
                    <button
                        className="bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-50 active:scale-95 transition-all duration-100 ease-in-out hover:cursor-pointer"
                        onClick={handleRemoteIce}
                    >
                        Click to add remote ICE candidates
                    </button>
                </div>
            </section>
        </div>
    );
};

export default App;

// The SDPs are being setted successfully but the remote media stream is not coming to the local peer and the peer is connected successfully event is also not happening
