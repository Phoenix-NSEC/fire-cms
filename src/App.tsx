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

type Unit = {
    name: string;
    description: string;
}

const unitsCollection = buildCollection<Unit>({
    name: "Units",
    singularName: "Unit",
    group: "Main",
    path: "units",
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
        name: {
            name: "Name",
            validation: { required: true },
            dataType: "string"
        },
        description: {
            name: "Description",
            validation: { required: true },
            dataType: "string",
            multiline: true
        }
    }
});

export default function App() {

    const collectionBuilder: EntityCollectionsBuilder = async ({ dataSource }) => {
        const units = await dataSource.fetchCollection<Unit>({
            path: "units",
            collection: unitsCollection
        });
        const lessonCollections = units.map(unit => buildCollection({
            name: unit.values.name,
            path: `units/${unit.id}/lessons`,
            description: unit.values.description,
            group: "Units",
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
        name={"My learning app"}
        collections={collectionBuilder}
        firebaseConfig={firebaseConfig}
    />;
}