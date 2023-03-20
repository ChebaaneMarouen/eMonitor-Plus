import { Ressource } from '@shared/redux';

export default function SettingsRessource(endpoint) {
  // TODO make datatype value dynamic !
  return new Ressource(endpoint, 'settings');
}
