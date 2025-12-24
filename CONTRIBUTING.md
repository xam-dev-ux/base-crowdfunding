# Contributing to Base Crowdfunding Platform

Thank you for your interest in contributing to the Base Crowdfunding Platform! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Crowdfunding.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Smart Contract Development

1. Write your contract changes in `contracts/`
2. Compile: `npm run compile`
3. Write tests in `test/` folder
4. Run tests: `npx hardhat test`
5. Deploy to testnet: `npm run deploy:testnet`

### Frontend Development

1. Start development server: `npm run dev`
2. Make your changes in `src/`
3. Test thoroughly in your browser
4. Ensure responsive design works on mobile

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Solidity
- Follow Solidity style guide
- Add NatSpec comments
- Use latest Solidity version (0.8.x)
- Optimize for gas efficiency
- Include security checks

### React/Next.js
- Use functional components with hooks
- Keep components focused and reusable
- Use proper prop types
- Handle loading and error states
- Follow Next.js best practices

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add milestone timeline component
fix: Resolve wallet connection issue
docs: Update README with deployment steps
style: Format code with Prettier
refactor: Improve campaign fetching logic
test: Add tests for contribution function
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update README.md with any new features
5. Create a Pull Request with a clear description
6. Link any related issues

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Works on mobile
```

## Reporting Bugs

Use GitHub Issues with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

## Feature Requests

We welcome feature suggestions! Please:
- Check if it's already requested
- Explain the use case
- Describe the expected behavior
- Consider implementation complexity

## Security

If you discover a security vulnerability:
- DO NOT open a public issue
- Email the maintainers directly
- Provide detailed information
- Wait for response before disclosure

## Questions?

Feel free to:
- Open a GitHub Discussion
- Ask in issues with "question" label
- Join the Base Discord community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing!
