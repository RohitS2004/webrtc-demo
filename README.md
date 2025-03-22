# WebRTC Demo 
- This project is used to demonstrate how to establish a peer to peer connection in the most simplest way. There is no any backend server involved in this project and no any STUN server is invloved.

# Why this project?
- As someone who has just strated with WebRTC protocol and is struggling to get his head around all sort of different APIs that you WebRTC provides, this is a good project demostrating all the basic stuff that goes into establishing a successful connection.

# Run the project locally on your machine
- Clone the repo
- Open a new terminal
- Run npm install (Make sure you have NodeJS installed in your computer)
- Run npm run dev (This will start the server)
- Go to your browser and type localhost:<port_no>
- Similarly open another tab in the browser and type the same url
- Now follow the process given below to establish a successful connection

# How to establish a connection?
- By now you have two tabs open in your local machine
- In the first tab click on the "Generate Offer" button
  - What this will do is that it will generate a SDP offer and set that as the local description for the first tab user and it will display the offer on the screen also
  - Now copy the SDP offer from the textarea above
  - Go the second tab
- In the second tab click the Add offer button after copy and pasting the SDP offer that was generated in the first tab
  - Why we are adding the SDP offer first for the second tab why not generating another SDP offer
  - In WebRTC offer is generated only once and the person (tab) who has generated the offer set this offer as his local description and then he passes this offer to the other person to whom he want to establish a connection with (second tab)
  - So when we click on the Add offer button the offer we will be added to the remote description for the second tab
  - Also note that you cannot generate a SDP answer before a remote offer
- In the second tab, now that we have the remote description we need to generate a SDP answer, click on the Generate answer button
  - What this will do
  - This will generate a SDP answer and set it to the local description for the second tab
  - After clicking on the button the SDP answer will be displayed on the textarea, copy that
- In the first tab, now go to the Add answer section and paste the answer from the second tab here and click on the button
- Now that we have exchanged the SDP offer and SDP answer between the two peers, we now need to exchange the ice candidates
- What are ice candidates? Ice candidate is an object containing the information such as public IP address and more which will be required to locate the remote peer on the internet, for generating ice candidate we have a special server known as STUN/TURN server which will return you back the ice candidate, this is a pretty vast topic you can read about it online for more clarity.
- In the first tab, click on the Generate ice candidates, copy the candidates once it is visible on the textarea
- In the second tab, go to the bottom paste the ice candidates in the Add ice candidates section and click on the button
- In the second tab, now click on the Generate ice candidates, copy the candidates once it is visible on the textarea and repeat the process for the first tab as done above.
