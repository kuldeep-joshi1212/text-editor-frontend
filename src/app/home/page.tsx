'use client';

import * as React from 'react';
import type { Value } from 'platejs';

import {
    BlockquotePlugin,
    BoldPlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
    ItalicPlugin,
    UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import {
    Plate,
    usePlateEditor,
} from 'platejs/react';
import toast from 'react-hot-toast';

import { BlockquoteElement } from '@/components/ui/blockquote-node';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { H1Element, H2Element, H3Element } from '@/components/ui/heading-node';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { ToolbarButton } from '@/components/ui/toolbar';
import {useUser} from "@clerk/nextjs";

const initialValue: Value = [
    {
        children: [{ text: 'Title' }],
        type: 'h3',
    },
    {
        children: [{ text: 'This is a quote.' }],
        type: 'blockquote',
    },
    {
        children: [
            { text: 'With some ' },
            { bold: true, text: 'bold' },
            { text: ' text for emphasis!' },
        ],
        type: 'p',
    },
];

export default  function MyEditorPage() {
    // State variable for API payload
    const [editorContent, setEditorContent] = React.useState<Value>(initialValue);
    const{user} =useUser();
    console.log("user", user);

    const editor = usePlateEditor({
        plugins: [
            BoldPlugin,
            ItalicPlugin,
            UnderlinePlugin,
            H1Plugin.withComponent(H1Element),
            H2Plugin.withComponent(H2Element),
            H3Plugin.withComponent(H3Element),
            BlockquotePlugin.withComponent(BlockquoteElement),
        ],
        value: () => {
            const savedValue = localStorage.getItem('installation-next-demo');
            const value = savedValue ? JSON.parse(savedValue) : initialValue;
            setEditorContent(value); // Initialize state with the loaded value
            return value;
        },
    });

    // Function to send content to API
    const sendToAPI = async () => {
        try {
            console.log("obj",editorContent)


            if(user?.id){
                const payload= {
                    content: editorContent,
                    userId: user.id,
                }
                console.log("payload",payload);

                const url ="http://localhost:8080/user/"+ user.id+"/save";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: editorContent,
                        userId: user?.id,

                    }),
                });

                if (response.ok) {
                    toast.success("Saved")
                    console.log('Content sent successfully!');
                } else {
                    console.error('Failed to send content');
                }
            }else{
                throw new Error('Failed to send content');
            }

        } catch (error) {
            console.error('Error sending to API:', error);
        }
    };

    React.useEffect(() => {
         
        const fetchData = async () => {
            
            if(!user?.id) return;
            try {
                const url = "http://localhost:8080/user/" + user?.id + "/get";
                
                const response = await fetch(url);
                const data = await response.json();
                
                if(data.content===null){
                    setEditorContent(initialValue);
                                    }else{
                                        setEditorContent(initialValue);
                                    }                    
                                    setEditorContent(data.content ?? {});
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [user?.id]);

    return (
        <Plate
            editor={editor}
            onChange={({ value }) => {
                localStorage.setItem('installation-next-demo', JSON.stringify(value));
                setEditorContent(value); // Update state when editor content changes
            }}
        >
            <FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
                <ToolbarButton onClick={() => editor.tf.h1.toggle()}>H1</ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>Quote</ToolbarButton>
                <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">B</MarkToolbarButton>
                <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">I</MarkToolbarButton>
                <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">U</MarkToolbarButton>
                <div className="flex-1" />
                <ToolbarButton
                    className="px-2"
                    onClick={() => {
                        editor.tf.setValue(initialValue);
                        setEditorContent(initialValue); // Update state when resetting
                    }}
                >
                    Reset
                </ToolbarButton>
                <ToolbarButton
                    className="px-2 bg-blue-500 text-white hover:bg-blue-600"
                    onClick={sendToAPI}
                >
                    Save to API
                </ToolbarButton>
            </FixedToolbar>
            <EditorContainer>
                <Editor placeholder="Type your amazing content here..." />
            </EditorContainer>
        </Plate>
    );
}