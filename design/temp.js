exports.patronsPatron_idPUT = async function (body, id) {
  let patron = null;
  try {
    patron = await PatronModel.findById(id);
  } catch (error) {
    throw new problem.Problem(
      problem.E_SERVER_FAULT,
      "Failed to retrieve patron."
    );
  }

  if (!patron)
    throw new problem.Problem(problem.E_NOT_FOUND, "User not found.");

  patron.email = body.email;
  patron.name = body.name;
  patron.updated_at = new Date();

  try {
    await patron.save();
  } catch (error) {
    throw new problem.Problem(
      problem.E_SERVER_FAULT,
      "Failed to update patron."
    );
  }

  return {
    _id: patron._id,
    name: patron.name,
    email: patron.email,
    updated_at: patron.updated_at,
  };
};

module.exports.patronsPatron_idPUT = function patronsPatron_idPUT(
  req,
  res,
  next,
  body,
  patron_id
) {
  Patrons.patronsPatron_idPUT(body, patron_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
