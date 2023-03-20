let uuid_reg = /_([^_]{24})$/;

export function getTypes(data) {
  let types = {};

  // match all containers
  types["all"] = /.*/;

  // extract application types from data
  for (let i = 0; i < data.length; i++) {
    let d = data[i];

    let container = d.name;

    const name_attributes = container.split("_");
    if (name_attributes.length > 2) {
      const type = name_attributes[0];
      types[type] = new RegExp("^" + type);
    }
  }

  // extract app ids from data
  for (let i = 0; i < data.length; i++) {
    let d = data[i];

    let container = d.name;

    let match = uuid_reg.exec(container);
    if (match) {
      // uuid corresponds to app_name
      // each app is its own type
      types["App:" + match[1]] = new RegExp(match[1]);
    }
  }

  return types;
}
