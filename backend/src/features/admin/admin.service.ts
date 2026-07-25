import { AdminRepository } from './admin.repository';

const adminRepository = new AdminRepository();

export class AdminService {
  async getStats() {
    return adminRepository.getStats();
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    return adminRepository.getUsers(page, limit, search);
  }

  async deleteUser(id: string) {
    await adminRepository.deleteUser(id);
  }

  async getReports(page = 1, limit = 20, status?: string) {
    return adminRepository.getReports(page, limit, status);
  }

  async updateReport(id: string, status: string) {
    return adminRepository.updateReportStatus(id, status);
  }
}
