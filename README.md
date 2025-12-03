# FGCU Art Gallery
A class project intended for potential use by the FGCU Library to display artwork they have stored in their Dataverse data repository. Collaborators: Edward Figueroa, Charles Marsala, Kyle Fillhart, and Vanessa Gutierrez.

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
- Gamma.app (to create PowerPoint presentations)

</br>

## Installation Guide

You can download the packaged version of our project under "Releases" on the rightmost side of the page. The version to download is v0.0.3.


#### -- Manual Installation of Project Dependencies --

To install React, please refer to this website: [React](https://react.dev/learn/creating-a-react-app) </br>
To install the Dataverse database, please refer to this website: [Dataverse](https://guides.dataverse.org/en/latest/installation/index.html) </br>
To install Dataverse using Docker, please refer to this website: [Dataverse Docker Download](https://guides.dataverse.org/en/latest/container/running/index.html)

Please note that if you are an FGCU student, it is easier to sign up for access to [FGCU's Dataverse](https://dataverse.fgcu.edu) than using any of the above methods. To do so, click on "Log In" in the upper-right corner of the page. Then under "Other Options," click on "Your Institution," which will use your FGCU Student Email to create your account. Accept the Terms & Conditions, then click on "Create Account." Under your account settings, click on a tab called "API Token," then click on the "Create Token" button to create an API Token. You can use your API Token with the Base URL (https://dataverse.fgcu.edu) and the Subtree "art" (where FGCU stores all its art in Dataverse), and connect these components to any front-end project you have.

If signing up for access to FGCU's Dataverse - for any reason - is not possible or you are not an FGCU student, please try to configure Dataverse using Docker as it is the second-easiest way to do so. If that does not work, please refer to the next paragraph.

If no other method of configuration worked or you decide to procede with the normal way of configuring Dataverse, please note that there are some vague instructions within the Dataverse Installation Guide and certain dependencies and/or files will have to be downloaded in order to proceed with the installation. A quick guide for how to deal with these ambiguous steps are:

- If you need to change any permissions or move files from user to user, you need to do so in the root or host user (ie: your_host_name@ip_address)
- If you need to create, edit, or delete anything pertaining to Payara, you need to do so in the dataverse user (ie: dataverse@ip_address)
- If you need to create, edit, or delete anything pertaining to Solr, you need to do so in the solr user (ie: solr@ip_address)
- If you need to create, edit, or delete anything pertaining to PostgreSQL, you need to do so in the postgres user (ie: postgres@ip_address)
- The PostgreSQL database and tables DO NOT and SHOULD NOT have to be created. The dvinstall.zip file (Dataverse Installation Guide linked above explains how to get this file) has script that will automatically create the database and the tables needed. You should, however, update the pg_hba.conf file (file path should be /var/lib/pgsql/16/data/pg_hba.conf) to include the name of the database and PostgreSQL user you would like the installer script to use.

</br>

## Metadata Schema Usage in Prototype

Our initial backend design included an ideal metadata schema for an art gallery, documented in [`docs/metadata/fgcuArtGallery.tsv`](./docs/metadata/fgcuArtGallery.tsv).

However, through API exploration, we discovered that the live FGCU Dataverse server utilizes its own custom metadata block named `"art"`. The current React prototype code fetches and utilizes fields from both this live "art" block and the standard "Citation" block.

The following table details the key fields currently implemented in the prototype, indicating how they are used for display, filtering, and search:

| Field Name (from FGCU API) | Used As     | Displayed? | Filterable? | Searchable? |
| :------------------------- | :---------- | :--------- | :---------- | :---------- |
| `title` (citation block)   | Title       | Yes        | No          | **Yes** |
| `artist` (art block)       | Creator     | Yes        | **Yes** | **Yes** |
| `dateCreated` (art block)  | Year        | Yes        | **Yes** | No          |
| `medium` (art block)       | Medium      | Yes        | **Yes** | No          |
| `artStyle` (art block)     | Genre       | Yes        | **Yes** | No          |
| `description` (citation) | Description | Yes        | No          | **Yes** |
| `dimensions` (art block)   | Dimensions  | Yes        | No          | No          |
| `accessionNumber` (art)    | Accession # | Yes        | No          | No          |
| `keywords` (citation)      | Keywords    | Yes        | No          | No          |
| `subjects` (citation)      | Subjects    | Yes        | No          | No          |
| `publicationDate` (API)    | Pub. Date   | Yes        | No          | No          |
| `collection` (art block)   | Collection  | Yes        | No          | No          |
| `creditLine` (art block)   | Credit Line | Yes        | No          | No          |
| `persistentId` (API)       | DOI/ID      | Yes        | No          | No          |

**Note:** The main `Title` and `Description` are handled by Dataverse's built-in **Citation Metadata** block. Our initial design in the `.tsv` file closely matched the fields discovered in FGCU's live "art" metadata block, validating our approach.

---

### Purpose

These metadata fields provide the structured, searchable details for the artworks displayed in the prototype. The React frontend dynamically queries the live FGCU Dataverse server using its REST APIs (`/api/search`, `/api/datasets`, `/api/access`) to fetch this data.

---

### How It Connects to the System Architecture

- FGCU Curators input this data directly into the live **FGCU Dataverse web interface**.
- This data is stored in the **FGCU PostgreSQL database**.
- Our **React frontend prototype** retrieves and displays this live data using FGCU Dataverse’s APIs, powering the search, filtering, and artwork display in the public gallery prototype.

For a visual overview of the system’s communication flow, see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

*(**Action Item:** The current API call in `GalleryView.tsx` needs to be corrected to use the `/api/search` endpoint and proper header authentication as documented in `docs/API_GUIDE.md` to fetch live data instead of relying on mock data.)*
