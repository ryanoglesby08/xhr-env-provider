/* global describe, beforeEach, it */

import {expect} from "chai";
import nock from "nock";

import EnvProvider from '../src/EnvProvider';

describe("Env Provider", () => {
  let envProvider;

  beforeEach(() => {
    envProvider = EnvProvider("http://test.host/config", "JS-ENV");
  });

  it("fetches environment configuration from a remote server", () => {
    nock("http://test.host")
      .head("/config")
      .reply(200, "", {
        "JS-ENV": '{"SOME_KEY": "the-value"}'
      });

    return envProvider.value("SOME_KEY")
      .then((value) => expect(value).to.eql("the-value"));
  });

  it("memoizes the environment values after an initial remote fetch", () => {
    nock("http://test.host")
      .head("/config")
      .reply(200, "", {
        "JS-ENV": '{"SOME_KEY": "the-value", "OTHER_KEY": "another value"}'
      });

    return envProvider.value("SOME_KEY")
      .then(() => envProvider.value("OTHER_KEY"))
      .then((otherValue) => expect(otherValue).to.eql("another value"));
  });
});
