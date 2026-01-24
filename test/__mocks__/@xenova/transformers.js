const mockPipeline = jest.fn().mockImplementation(() => ({
  // Mock pipeline function that returns fake embeddings
}));

const mockTensor = {
  data: new Float32Array(384).map(() => Math.random() - 0.5), // 384-dimensional random vector
};

mockPipeline.mockResolvedValue({
  data: new Float32Array(384).map(() => Math.random() - 0.5),
});

module.exports = {
  pipeline: mockPipeline,
  Tensor: jest.fn().mockImplementation(() => mockTensor),
};
