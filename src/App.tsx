import React from "react";
import {
    buildCollection,
    EntityCollectionsBuilder,
    FirebaseCMSApp
} from "firecms";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

// TODO: Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyBw4mgLgM6im3_xsLe7DTa9P7ONm9GjnjU",
  authDomain: "phoenix-c88b9.firebaseapp.com",
  projectId: "phoenix-c88b9",
  storageBucket: "phoenix-c88b9.appspot.com",
  messagingSenderId: "974004018957",
  appId: "1:974004018957:web:4b0291359f5e7dc13b5a44",
  measurementId: "G-VS8D3ZRBCJ"
};

type Admins = {
    email: string;
    name: string;
    isAdmin: boolean;
}

const unitsCollection = buildCollection<Admins>({
    name: "Admins",
    singularName: "Admins",
    group: "Main",
    path: "Admins",
    customId: true,
    icon: "LocalLibrary",
    callbacks: {
        onSaveSuccess: ({ context }) => {
            context.navigation.refreshNavigation();
        },
        onDelete: ({ context }) => {
            context.navigation.refreshNavigation();
        }
    },
    properties: {
        email: {
            name: "email",
            validation: { required: true },
            dataType: "string"
        },
        name: {
            name: "name",
            validation: { required: true },
            dataType: "string",
            multiline: true
        },
         isAdmin: {
            name: "isAdmin",
            validation: { required: true },
            dataType: "boolean",
        }
    }
});

export default function App() {

    const collectionBuilder: EntityCollectionsBuilder = async ({ dataSource }) => {
        const units = await dataSource.fetchCollection<Admins>({
            path: "Admins",
            collection: unitsCollection
        });
        const lessonCollections = units.map(unit => buildCollection({
            name: unit.values.name,
            path: `units/${unit.id}/lessons`,
            description: unit.values.description,
            group: "Admins",
            properties: {
                name: {
                    name: "Name",
                    dataType: "string"
                }
            }
        }));

        return [
            unitsCollection,
            ...lessonCollections
        ]
    };

    return <FirebaseCMSApp
        name={"Phoenix Admin"}
        collections={collectionBuilder}
        firebaseConfig={firebaseConfig}
    />;
}
