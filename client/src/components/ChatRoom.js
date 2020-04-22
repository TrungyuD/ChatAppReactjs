import styled from "styled-components";

export const Page = styled.div`
display: flex;
height: 100vh;
width: 100%;
align-items: center;
background-color: #46516e;
flex-direction: column;
`;

export const ChatRoom = styled.div`
display: flex;
flex-direction: column;
height: 350px;
max-height: 500px;
overflow: auto;
border: 1px solid lightgray;
border-radius: 10px;
padding-bottom: 10px;
margin-top: 25px;
`;
export const TextArea = styled.textarea`
width: 100%;
height: 100px;
border-radius: 10px;
margin-top: 10px;
padding-left: 10px;
padding-top: 10px;
font-size: 17px;
background-color: transparent;
border: 1px solid lightgray;
outline: none;
color: black;
letter-spacing: 1px;
line-height: 20px;
::placeholder {
  color: lightgray;
}
`;

export const ButtonCustom = styled.button`
background-color: pink;
width: 100%;
border: none;
height: 50px;
border-radius: 10px;
color: #46516e;
font-size: 17px;
`;
export const FormCustom = styled.form`
width: 100%;
`;

export const MyRow = styled.div`
width: 100%;
display: flex;
justify-content: flex-end;
margin-top: 10px;
`;
export const MyMessage = styled.div`
width: 45%;
background-color: pink;
color: #46516e;
padding: 10px;
margin-right: 5px;
border-top-right-radius: 10%;
border-bottom-right-radius: 10%;
`;
export const PartnerRow = styled(MyRow)`
justify-content: flex-start;
`;
export const PartnerMessage = styled.div`
width: 45%;
background-color: transparent;
color: #46516e;
border: 1px solid lightgray;
padding: 10px;
margin-left: 5px;
border-top-left-radius: 10%;
border-bottom-left-radius: 10%;
`;

export const ContainerCustom = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;



export const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;