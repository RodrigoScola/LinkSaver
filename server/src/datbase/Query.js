export class BaseQueryType {
  /** @type {QueryMethod } */
  type 

  /** @type {string} */
  key = "";

  /** @type {any} */
  value = "";

  /** @param {QueryMethod } type */
  constructor(type) {
    this.type = type;
  }
}

export class EqualQueryType extends BaseQueryType {
  /**
   * @param {string} key
   * @param {any} value
   */
  constructor(key, value) {
    super("where"); // assuming 'where' corresponds to 'eq' logic
    this.key = key;
    this.value = value;
  }
}

export class LikeQueryType extends BaseQueryType {
  /**
   * @param {string} key
   * @param {string} value
   */
  constructor(key, value) {
    super("whereILike"); // knex method for ilike (case-insensitive)
    this.key = key;
    this.value = value + "%";
  }
}

export class SearchQueryType extends BaseQueryType {
  /**
   * @param {string} key
   * @param {string} value
   */
  constructor(key, value) {
    super("whereRaw"); // Use raw text search example
    this.key = key;
    this.value = `'${value}'`; // raw SQL fragment, may want to customize
  }
}

export class RangeQueryType extends BaseQueryType {
  /**
   * @param {string } key
   * @param {number} start
   * @param {number} end
   */
  constructor(key, start = 0, end = 1) {
    super("whereBetween");
	this.key = key
    this.value = [Math.min(start, end), Math.max(start, end)];
  }
}

export class SelectQueryType extends BaseQueryType {
  /**
   * @param {QueryMethod} type
   * @param {Array<string>} items
   */
  constructor(type, items = []) {
    super(type);
    this.value= items;
  }
}

export class OrderByQueryType extends BaseQueryType {
  /**
   * @param {string} column
   * @param {string} option
   */
  constructor(column, option = "") {
    super("orderBy");
    this.key = column;
    this.value = option.startsWith("asc") ? "asc" : "desc";
  }
}

/**
 * Wraps a query option
 */
export class QueryOption {
  /**
   * @param {BaseQueryType} option
   */
  constructor(option) {
    this.option = option;
  }

  get type() {
    return this.option.type;
  }
  get key() {
    return this.option.key;
  }
  get value() {
    return this.option.value;
  }
  get options() {
    return (/** @type {any} */ (this.option.options)) || null;
  }
}

/**
 * Handles multiple query options and applies them to a base query
 */
export class QueryOptions {
  /** @type {QueryOption[]} */
  #_options = [];

  /** @type {BaseQuery} */
  query;

  /**
   * @param {BaseQuery} baseQuery
   * @param {BaseQueryType[]} [baseOptions=[]]
   */
  constructor(baseQuery, baseOptions = []) {
    this.query = baseQuery;
    baseOptions.forEach((option) => this.add(option));
  }

  /**
   * @param {BaseQueryType} option
   */
  add(option) {
    this.#_options = [...this.#_options, new QueryOption(option)];
  }

  /**
   * @param {BaseQueryType} option
   * @returns {this}
   */
  remove(option) {
    this.#_options = this.#_options.filter(
      (item) => item.option !== option
    );
    return this;
  }

  /**
   * @returns {QueryOption[]}
   */
  get items() {
    return this.#_options;
  }

  /**
   * Applies all options to the query and returns the final query builder
   * @returns {BaseQuery}
   */
  get options() {
    this.#_options.forEach((item) => {
      const type = item.type;
      const key = item.key;
      const value = item.value;
      const options = item.options;

      // Safety check: only call if method exists and is a function on query
      if (typeof this.query[type] === "function") {
        // Handle different arities based on the method
        if (value === undefined) {
			       //@ts-ignore
          this.query = this.query[type](key);
        } else if (options === null || options === undefined) {
			       //@ts-ignore
          this.query = this.query[type](key, value);
        } else {
			       //@ts-ignore
          this.query = this.query[type](key, value, options);
        }
      } else {
        throw new Error(`Query method "${type}" does not exist on knex query builder.`);
      }
    });
    return this.query;
  }
}
