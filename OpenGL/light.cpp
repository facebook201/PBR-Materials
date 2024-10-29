
void main() {
  // 环境因子
  float ambientStrength = 0.1;
	
	glm::vec3 lightColor(1.0f, 1.0f, 1.0f);
	glm::vec3 toyColor(1.0f, 0.5f, 0.31f);

	// 环境因子 乘以太阳光
	vec3 ambient = ambientStrength * lightColor;
	vec3 result = ambient * toyColor;

	// 最终颜色
	FragColor color = vec4(result, 1.0f);
}


