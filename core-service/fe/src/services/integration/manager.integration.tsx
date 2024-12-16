class ManagerIntegrationService {
  private listRegisteredServices: { [key: string]: boolean } = {};

  addRegisteredService(clientId: string) {
    this.listRegisteredServices[clientId] = true;
  }

  checkRegisteredService(clientId: string) {
    return this.listRegisteredServices[clientId];
  }
}

export const managerIntegrationService = new ManagerIntegrationService();
