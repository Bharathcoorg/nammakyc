# Android development

The Android client is a React Native application managed with Expo.

The initial client intentionally contains only the application shell and synthetic household lookup path. Aadhaar Face Authentication integration must use the authorized AadhaarFaceRD flow and must not be replaced by a custom face-matching implementation.

Production builds should receive the API base URL through environment-specific configuration; production credentials and endpoints must not be committed.
