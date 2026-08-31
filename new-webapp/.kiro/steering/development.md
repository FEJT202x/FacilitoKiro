# Development Workflow

This document defines the development workflows and processes for the Prostate MRI Viewer project following the SDD methodology.

## Development Phases

### Phase 1: Structure (Completed)
- [x] Define project architecture
- [x] Create directory structure
- [x] Configure `.kiro/` settings

### Phase 2: Definition (v1 - In Progress)
- [x] Define basic requirements for MRI viewer
- [ ] Define technical specifications
- [ ] Establish conventions and standards
- [ ] Document security requirements

### Phase 3: Development (v1 - DICOM Viewer)
- [ ] Set up React + TypeScript + Vite project
- [ ] Integrate Cornerstone3D and DICOM image loader
- [ ] Implement DICOM file/series loading (drag & drop / picker)
- [ ] Render slices with window/level (VOI LUT)
- [ ] Add stack scroll, zoom, pan, and WW/WC tools
- [ ] Display DICOM metadata panel
- [ ] Handle malformed/unsupported DICOM gracefully
- [ ] Write tests

### Phase 4: Iteration (v2+)
- [ ] Multi-planar reconstruction (MPR)
- [ ] Segmentation overlays
- [ ] DICOMweb / PACS (Orthanc) integration
- [ ] Clinical annotations and measurements
- [ ] Production deployment

## Git Workflow

```
main
 │
 ├─── v1/basic-viewer
 ├─── v1/image-nav
 ├─── v2/dicom-support
 ├─── v3/3d-visualization
 ├─── bugfix/image-loading
 └─── hotfix/critical-bug
```

### Branching Strategy

1. **Feature Branches**
   - Name: `feature/feature-name`
   - Example: `feature/user-auth`

2. **Bugfix Branches**
   - Name: `bugfix/issue-description`
   - Example: `bugfix/login-error`

3. **Hotfix Branches**
   - Name: `hotfix/urgent-description`
   - Example: `hotfix/security-patch`

4. **Release Branches**
   - Name: `release/version-number`
   - Example: `release/v1.0.0`

### Git Flow

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/user-auth

# 2. Make changes and commit
git add .
git commit -m "feat: add user authentication"

# 3. Push branch
git push origin feature/user-auth

# 4. Create pull request
gh api repos/OWNER/REPO/pulls -f title="..." -f body="..." -f head="feature/user-auth" -f base="main"

# 5. Merge after review
```

## Development Process

### 1. Planning
- Review requirements in `definition.md`
- Create feature specification in `specs/`
- Get specification approved by team

### 2. Implementation
- Create branch from `main`
- Implement according to specifications
- Follow code style conventions

### 3. Testing
- Write unit tests for new features
- Run integration tests
- Verify all acceptance criteria met

### 4. Review
- Submit pull request
- Address review comments
- Get approval from reviewer

### 5. Deployment
- Merge to `main`
- Create release tag
- Deploy to target environment

## Coding Standards

### TypeScript/React

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

// ❌ Bad
const user = {id:'1',name:'John'};
function gUB(id){return users.find(u=>u.id===id);}
```

### Node.js/Express

```javascript
// ✅ Good
const express = require('express');
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ❌ Bad
app.get('/users', (req, res) => {
  // No error handling
  const users = db.query('SELECT * FROM users');
  res.json(users);
});
```

## Medical Imaging Standards

### DICOM (Digital Imaging and Communications in Medicine)

- **Standard format** for medical imaging
- **Required for production** use in clinical environments
- Includes image data + patient metadata

### OHIF Viewer

- Open-source medical imaging viewer
- Built on React and cornerstone3D
- DICOM support out of the box
- Can be embedded or used as a base

### Image Formats

| Format | Use Case |
|--------|----------|
| JPEG/PNG | Simple images, testing |
| DICOM | Production clinical use |
| NIfTI | Research/3D imaging |

## Code Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities introduced
- [ ] Performance considerations addressed
- [ ] Error handling is adequate
- [ ] TypeScript types are properly defined
- [ ] Medical standards compliance (DICOM, etc.)

## Medical Software Specific Checks

- [ ] Patient privacy protected
- [ ] Data integrity maintained
- [ ] Audit trails implemented (for future versions)
- [ ] Error messages are clear for clinical staff
- [ ] No data loss on unexpected errors
- [ ] Compliance with medical device regulations (as needed)

## Continuous Integration

### Automated Checks

1. **Linting**
   ```bash
   npm run lint:frontend    # TypeScript/React
   npm run lint:backend     # Node.js
   ```

2. **Testing**
   ```bash
   npm test:frontend        # Frontend tests
   npm test:backend         # Backend tests
   npm run test:coverage    # Coverage report
   ```

3. **Build**
   ```bash
   npm run build:frontend
   npm run build:backend
   npm run build:docker
   ```

### CI/CD Pipeline

```yaml
name: CI/CD
on:
  push:
    branches: [main, feature/*]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Run frontend tests
        run: npm run test:frontend
      - name: Run backend tests
        run: npm run test:backend
      - name: Run linting
        run: npm run lint
```

## Deployment Process

### Development Environment
1. Deploy to sandbox environment
2. Run integration tests
3. Verify image loading and display

### Staging Environment
1. Deploy to staging
2. Run full test suite
3. DICOM file compatibility test
4. Clinical user feedback session

### Production Deployment
1. Create release branch
2. Run all tests
3. Deploy to production
4. Monitor for issues
5. Collect clinical feedback

## Security Considerations

### Medical Data Privacy

- **HIPAA/GDPR compliance** for patient data
- **Encryption** at rest and in transit
- **Access controls** for authorized users only
- **Audit logging** for data access (future versions)

### Image Data Security

- Secure upload/download of medical images
- Patient ID anonymization (as needed)
- Proper handling of sensitive medical data

## Troubleshooting

### Common Issues

1. **Build failures**
   - Check dependency versions
   - Verify environment variables
   - Review build logs

2. **Test failures**
   - Check test data setup
   - Verify mock configurations
   - Review test isolation

3. **Deployment issues**
   - Check environment configuration
   - Verify service dependencies
   - Review deployment logs

## References

- [[file:structure.md]] - Project structure and architecture
- [[file:definition.md]] - Requirements and specifications


---

## Post-Change Workflow

### After Any Change (Code or Documentation)

When a change is made to the project (whether in code or documentation), the following must be done:

1. **Make the change** - Update code, configuration, or documentation
2. **Test the change** - Run tests to verify the change works correctly
3. **Commit the change** - Use descriptive commit messages following the format: `<type>: <description>`
4. **Update documentation** - Ensure all relevant documentation reflects the change
5. **Update specifications** - If the change affects functionality, update the relevant specification in `docs/specifications/`

### Git Workflow

```bash
# 1. Make your changes (code or documentation)
# 2. Test the changes
# 3. Stage changes
git add .

# 4. Commit with descriptive message
git commit -m "feat: add image loading functionality"

# 5. Update documentation if needed
# 6. Push to repository
git push origin feature/your-feature
```

### Commit Message Format

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Version Updates

- Update `version` in `package.json` following semantic versioning
- Create a new version document in `docs/specifications/vX.md`
- Tag the release: `git tag v1.0.0`
