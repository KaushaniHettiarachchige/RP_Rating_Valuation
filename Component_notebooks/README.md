This README file contains the modeling, evaluation and valuation-support tasks that completed after dataset creation - as part of the Property Object Detection component.

⚡Here, it applies Deep Learning to complete the component.And focuses on classifying land-cover and property context from images and convert model predictions into prototype rating valuation calculations.

⚡Datasets Used:
  1. Satellite Dataset
      🔸Identify what exist inside a land parcel
      🔸Classes: bare_lands, buildings, vegetations
  2. Street-View Dataset
      🔸Identify ground-level property context
      🔸Classes: building_front, boundary_wall_gates, vegetation

⚡Image preprocessing and data pipeline
  After dataset creation,
      🔸All images resized to 128 * 128 pixels
      🔸Images loaded using image_dataset_from_directory
      🔸Data pipeline optimized using: batching and prefetching (to improve training performance)

⚡Deep Learning models implemented
  1. Satellite CNN model
      🔸Input: 128 × 128 RGB satellite images
      🔸Architecture: Convolution layers, Max pooling, dropout, fully connected dense layers
      🔸Output: Probability distribution over land-cover classes
      🔸Trained using: Adam optimizer, Sparse categorical cross-entropy loss

  2. Street-View CNN model
      🔸Input: 128 × 128 RGB street view images
      🔸Architecture: same as satellite model
      🔸Output: Probability distribution over property-context classes
      🔸Trained using: Adam optimizer, Sparse categorical cross-entropy loss

⚡Model Evaluation
  1. Confusion Matrices
      🔸For both datasets, confusion matrices were generated using the test set to visualize class-wise prediction and to identify confusion between visually similar classes

  2. Classification Reports
      🔸For both models, classification reports were generated that showing precision, recall, F1-score and support(no of test samples)

⚡External Image testing
      🔸Used some external images that not included in the datasets, to test trained models.
      🔸The model predicted class label and confidence score

⚡Prototype Rating Valuation Calculation
      🔸Valuation logic(prototype only) - Model predicted class select a valuation factor
      🔸Valuation score computed as: Annual value = Base rate × Area × Factor (This is not an official municipal valuation formula and used only for my component demonstration)

⚡Calculate rates payable
      🔸Convert Annual value into Rates payable.
      🔸Rates payable = Annual value × Rate percentage (This also only e demo)
