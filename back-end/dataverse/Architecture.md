# System Architecture: FGCU Art Gallery Prototype

This document outlines the system architecture for the FGCU Art Gallery prototype, which employs a **decoupled, "headless" model**.

Our prototype consists of two primary components:
1.  **Frontend Application:** A custom-built React application that serves as the public-facing user interface. This includes **simulated admin controls** that modify the view *within the browser session only*.
2.  **Backend System:** The **live FGCU Dataverse repository** (`dataverse.fgcu.edu`), which functions as the data source and API provider.

Our React application acts as a "client," **reading published data** directly from the live FGCU server using its public REST APIs. It **does not write** data back to the FGCU server; admin features are simulated locally.

```mermaid
graph TD
subgraph "User (Browser)"
U(Gallery Visitor / Simulated Admin)
end

subgraph "Custom React Frontend (Prototype)"
R[React Gallery UI Includes Simulated Admin Controls]
API[React Components using Fetch/Axios]
end

subgraph "Live FGCU Dataverse Backend (dataverse.fgcu.edu)"
API_S[Search API]
API_N[Native API]
API_A[Access API]
DB[(FGCU PostgreSQL DB)]
FS[(FGCU File Storage)]
end

%% Visitor Flow (Read-Only Prototype)
U -- 1. Loads Gallery Page --> R
R -- 2. Fetches All Art Data --> API
API -- 3. Calls Search API (/api/search?subtree=art...) --> API_S
API_S -- 4. Queries Metadata --> DB
DB -- 5. Metadata JSON --> API_S
API_S -- 6. Results JSON --> API
API -- 7. Renders Page --> R
R -- 8. Renders Thumbnails using Access API --> U
U -- 9. Clicks image/download link (/api/access/datafile/{id}) --> API_A
API_A -- 10. Retrieves Image File --> FS
FS -- 11. Image file --> API_A
API_A -- 12. Image displayed / File downloaded --> U

%% Note: Data Upload is handled by FGCU Admins
subgraph "FGCU Internal Process (Not part of Prototype Build)"
style FGCU Internal Process fill:#eee,stroke:#ccc,stroke-dasharray: 5 5
A(FGCU Admin / Curator)
DV_UI[Standard Dataverse Web UI on fgcu.edu]
A -- Logs In --> DV_UI
DV_UI -- Creates/Edits Datasets --> DB
DV_UI -- Uploads Files --> FS
end
