const ImageSplitter = ({ imageUrl }) => {
  const containerWidth = 600;
  const baseHeight = 300;
  const partWidth = containerWidth / 3;

  // Marcelina, you can use this array to chnage the heights of each images, from [0 (been the lowest)- 2 (been the highest)]
  const heightScales = [1.25, 2, 1.75];

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
      {heightScales.map((scale, i) => (
        <div
          key={i}
          style={{
            width: `${partWidth}px`,
            height: `${baseHeight * scale}px`,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${containerWidth}px auto`, 
            backgroundPosition: `-${i * partWidth}px 0`,
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}
    </div>
  );
};

export default ImageSplitter;
