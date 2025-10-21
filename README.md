# FGCU-Art-Gallery
A class project intended for potential use by the FGCU Library to display artwork they have stored in their Dataverse data repository. Collaborators: Jack Ziemski, Charles Marsala, Edward Figueroa, Kyle Fillhart, and Vanessa Gutierrez.

</br>

## Tech Stack Used
- Rocky Linux v10
- Vite + React (Vite v7.1.8)
- Dataverse v.6.8
- Java 17
- Payara 6
- Solr 9.8.0
- PostgreSQL 16
- jq (comes installed with Rocky Linux 10)

</br>

## AI Tools Used
- Figma Make (to create a prototype)

</br>

## Installation Guide

To install React, please refer to this website: [React](https://react.dev/learn/creating-a-react-app) </br>
To install the Dataverse database, please refer to this website: [Dataverse](https://guides.dataverse.org/en/latest/installation/index.html)

Please note that there are some vague instructions within the Dataverse Installation Guide and certain dependencies and/or files will have to be downloaded in order to proceed with the installation. A quick guide for how to deal with these ambiguous steps are:

- If you need to change any permissions or move files from user to user, you need to do so in the root or host user (ie: your_host_name@ip_address)
- If you need to create, edit, or delete anything pertaining to Payara, you need to do so in the dataverse user (ie: dataverse@ip_address)
- If you need to create, edit, or delete anything pertaining to Solr, you need to do so in the solr user (ie: solr@ip_address)
- If you need to create, edit, or delete anything pertaining to PostgreSQL, you need to do so in the postgres user (ie: postgres@ip_address)
- The PostgreSQL database and tables DO NOT and SHOULD NOT have to be created. The dvinstall.zip file (Dataverse Installation Guide linked above explains how to get this file) has script that will automatically create the database and the tables needed. You should, however, update the pg_hba.conf file (file path should be /var/lib/pgsql/16/data/pg_hba.conf) to include the name of the database and PostgreSQL user you would like the installer script to use.

## Metadata Schema (docs/metadata/fgcuArtGallery.tsv)

This file defines the metadata block used by the FGCU Art Gallery within the Dataverse backend.

Each dataset in Dataverse represents a single artwork and uses these fields to store descriptive information. These metadata fields enable faceted search (filtering) in the custom React gallery, allowing visitors to browse by Artist, Medium, or Year.

| Field Name | Display Name | Description | Facetable |
| :--- | :--- | :--- | :--- |
| `artistName` | Artist | Primary creator/artist of the work. | **Yes** |
| `workYear` | Year of Work | Year the artwork was completed (YYYY). | **Yes** |
| `medium` | Medium | Materials or form used to create the work. | **Yes** |
| `dimensions` | Dimensions | Physical size of the artwork. | No |
| `copyrightNote` | Copyright / Rights Note | Any rights notes beyond the selected license. | No |
| `curatorialNote` | Curatorial Note | Brief curatorial/contextual description. | No |
| `accessionNumber`| Accession Number | Museum/library accession or catalog number. | No |

**Note:** The main `Title` and `Description` for each artwork are handled by Dataverse's built-in **Citation Metadata** block, which is standard practice.

### Purpose

These metadata fields provide structured, searchable details about each artwork. They allow the React frontend to dynamically query Dataverse for specific artists, mediums, or dates using the Dataverse REST APIs (/api/search, /api/datasets, /api/access).

### How It Connects to the System Architecture

- Curators fill out these fields directly in the Dataverse web interface when uploading new artworks.
- Once published, these records are stored in the Dataverse PostgreSQL database.
- The React frontend retrieves and displays them using Dataverse’s APIs, powering the search, filtering, and artwork display in the public gallery.

For a visual overview of the system’s communication flow, see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
