import {
  scenario,
  simulation,
  constantUsersPerSec
} from "@gatling.io/core";
import { http } from "@gatling.io/http";

export default simulation((setUp) => {
  const httpProtocol =
  http.baseUrl("https://api.restful-api.dev")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json");

  const testPing = scenario("Test Ping")
    .exec(http("Ping Request").get("/objects/"));

  setUp(
      testPing.injectOpen(constantUsersPerSec(2).during(60))
    ).protocols(httpProtocol);

});