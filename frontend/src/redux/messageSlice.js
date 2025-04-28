// import {createSlice} from "@reduxjs/toolkit";

// const messageSlice = createSlice({
//     name:"message",
//     initialState:{
//         messages:null,
//     },
//     reducers:{
//         setMessages:(state,action)=>{
//             state.messages = action.payload;
//         }
//     }
// });
// export const {setMessages} = messageSlice.actions;
// export default messageSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: null,
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        updateMessage: (state, action) => {
            const { messageId, newMessage } = action.payload;
            const msg = state.messages.find(m => m._id === messageId);
            if (msg) {
              msg.message = newMessage;
            }
          }
          
        ,
        removeMessage: (state, action) => {
            if (state.messages) {
                // Case 1: If messages is an array
                if (Array.isArray(state.messages)) {
                    state.messages = state.messages.filter(
                        (msg) => msg._id !== action.payload
                    );
                }
                // Case 2: If messages is an object (key-value pairs)
                else if (typeof state.messages === 'object') {
                    delete state.messages[action.payload];
                }
            }
        }
    }
});

export const { setMessages, removeMessage,updateMessage } = messageSlice.actions;
export default messageSlice.reducer;