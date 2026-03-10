This folder contains Google Colab notebooks that related to datasets.

🗨️ Overview of Both Datasets - (Satellite dataset and Street View dataset)
      Both datasets consist of images from satellite imagery and street view imagery. The goal is to detect and classofy objects like bare_land, buildings, vegetations to improve rating valuation in Sri Lanka.

  🔸Satellite dataset 
    - Used to detect bare lands, buildings, vegetations from satellite imagery.
    - Images collected from Google Earth Pro.
    - Have three classes 
        bare_land - include images of lands with no structures
        buildings - include images of buildings (commercial/residential)
        vegetations - include images of crops, plantations, trees
    - Dataset structure
        satellite_dataset_new/
          ├── train/
          │   ├── bare_lands/
          │   ├── buildings/
          │   └── vegetations/
          ├── val/
          │   ├── bare_lands/
          │   ├── buildings/
          │   └── vegetations/
          ├── test/
          │   ├── bare_lands/
          │   ├── buildings/
          │   └── vegetations/
          ├── data.yaml
          └── metadata.csv

  🔸Street View dataset
    - Used to detect boundary walls,gates, buildings from street view imagery.
    - Images are collected from Google Map street view.
    - Have three classes
       boundary_wall_gates - include images of boundary walls and gates
       building_front - include images of buildings from the street level
       vegetation - include images of crops from street level
    - Dataset structure
        street_view_dataset_new/
          ├── train/
          │   ├── boundary_wall_gates/
          │   ├── building_front/
          │   └── vegetation/
          ├── val/
          │   ├── boundary_wall_gates/
          │   ├── building_front/
          │   └── vegetation/
          ├── test/
          │   ├── boundary_wall_gates/
          │   ├── building_front/
          │   └── vegetation/
          ├── data.yaml
          └── metadata.csv

🔸data.yaml - include paths to the datasets, no.of classes and names of classes
🔸metadata.csv - include additional information about each image such as, image name, image path, width, height, label, class.

🔸Data Preprocessing & Augmentation
  Both datasets were expanded using Data Preprocessing and Data Augmentation - to prevent overfitting and to improve the model's ability to generalize.
  Data Augmentation Techniques used : Random rotations, flipping, brightness adjustments, zooming, noise addition, shifting

🔸Image Resizing
  Images of both datasets were resized to 128*128 to make them uniform and compatible with the model input.
  Used Pillow library to resize images.

🔸Splitting
  Both datasets were split into train/test/val sets.
    70% - Training - for training the model
    15% - Testing - for final model evaluation
    15% - Validation - for hyperparameter tuning and model evaluation.
