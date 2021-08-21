// getting all the styles from the root element of our document.
const rootStyles = window.getComputedStyle(document.documentElement);

// make sure we are ready to use get property.
// If the style hasn'e been loaded yet, this ready() won't be called.
if (
  rootStyles.getPropertyValue("--book-cover-width-large") != null &&
  rootStyles.getPropertyValue("--book-cover-width-large") !== ""
) {
  ready();
} else {
  // once main css is loaded, we'll have access to the property values.
  document.getElementById("main-css").addEventListener("load", ready);
}

function ready() {
  // these variables are return as string and need to be parsed to float
  const coverWidth = parseFloat(
    rootStyles.getPropertyValue("--book-cover-width-large")
  );
  const coverAspectRatio = parseFloat(
    rootStyles.getPropertyValue("--book-cover-aspect-ratio")
  );
  const coverHeight = coverWidth / coverAspectRatio;

  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight,
    imageResizeMode: "cover",
  });

  FilePond.parse(document.body);
}
