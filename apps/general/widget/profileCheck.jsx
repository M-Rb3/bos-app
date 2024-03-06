const accountId = context.accountId;
const sybilProvider = props.sybilProvider;
const contract = "v1.socialcheck.near";
if (!accountId) {
  return "Please sign in with NEAR wallet to edit your profile";
}

const initialProfile = Social.getr(`${accountId}/profile`);
if (initialProfile === null) {
  return "Loading";
}

const [profile, setProfile] = useState(initialProfile || {});
const [fieldErrors, setFieldErrors] = useState({});
const [prompt, setPrompt] = useState("");

// Define the validation function
function isProfileValid(profile) {
  let invalidFields = [];

  if (typeof profile?.name !== "string" || profile.name?.trim() === "") {
    invalidFields.push("name");
  }

  const isStandardImageValid =
    profile.image?.ipfs_cid && typeof profile.image?.ipfs_cid === "string";
  const isNftImageValid =
    profile.image?.nft && typeof profile.image.nft?.contractId === "string";
  const isUrlImageValid =
    profile.image?.url && typeof profile.image?.url === "string";

  if (!isNftImageValid && !isStandardImageValid && !isUrlImageValid) {
    invalidFields.push("image");
  }

  const isBackgroundImageValid =
    profile.backgroundImage?.ipfs_cid &&
    typeof profile.backgroundImage?.ipfs_cid === "string";
  const isBackgroundNftValid =
    profile.backgroundImage?.nft &&
    typeof profile.backgroundImage?.nft.contractId === "string";
  const isBackgroundUrlValid =
    profile.backgroundImage?.url &&
    typeof profile.backgroundImage?.url === "string";

  if (
    !isBackgroundImageValid &&
    !isBackgroundNftValid &&
    !isBackgroundUrlValid
  ) {
    invalidFields.push("backgroundImage"); // Corrected from "image" to "backgroundImage"
  }

  if (
    !profile.description ||
    typeof profile.description !== "string" ||
    profile.description.trim() === ""
  ) {
    invalidFields.push("description");
  }

  const hasValidTag = Object.values(profile.tags || []).some(
    (tag) => tag !== null
  );
  if (!hasValidTag) {
    invalidFields.push("tags");
  }

  const hasValidLinktree = ["twitter", "github", "telegram", "website"].some(
    (key) =>
      profile.linktree[key] &&
      typeof profile.linktree[key] === "string" &&
      profile.linktree[key].trim() !== ""
  );
  if (!hasValidLinktree) {
    invalidFields.push("linktree");
  }

  return {
    isValid: invalidFields.length === 0,
    invalidFields: invalidFields,
  };
}
const [isValidProfile, setIsValidProfile] = useState(
  isProfileValid(initialProfile || {})
);

function handleProfileChange(updatedProfile) {
  console.log("Profile updated:", updatedProfile);
  setProfile(updatedProfile);
}

function handleSubmit() {
  const newValidity = isProfileValid(profile);
  console.log("Is new profile valid?", newValidity);
  setIsValidProfile(newValidity.isValid);
  if (newValidity.isValid) {
    Near.call([
      {
        contractName: "social.near",
        methodName: "set",
        args: {
          data: { [accountId]: { profile } },
        },
        deposit: 4e22,
        gas: 4e13,
      },
      {
        contractName: contract,
        methodName: "verify_social_profile_completeness",
        gas: 7e13,
        deposit: 5e21,
      },
    ]);
  } else {
    // Update field errors
    const newFieldErrors = {};
    newValidity.invalidFields.forEach((field) => {
      newFieldErrors[field] = true;
    });
    setFieldErrors(newFieldErrors);
    setPrompt("Error Messages:");
  }
}

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 25px;
  max-width: 800px;
  width: fit-content;
  border-radius: 10px;
  white-space: nowrap;
  text-align: center;
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 99999;
  border-radius: 6px;
  box-shadow: rgba(14, 18, 22, 0.35) 0px 10px 38px -10px,
    rgba(14, 18, 22, 0.2) 0px 10px 20px -15px;
  transform: translate(-50%, -50%);
  .close-icon {
    margin-left: auto;
    margin-bottom: 1rem;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
`;

function renderErrorMessages() {
  const errorMessages = {
    name: "Name is required.",
    image: "Profile picture is required.",
    backgroundImage: "Background image is required.",
    description: "About section is required.",
    tags: "At least one tag is required.",
    linktree: "At least one external profile link is required..",
  };

  return Object.keys(fieldErrors)
    .filter((field) => fieldErrors[field]) // Filter out fields without errors
    .map((field) => (
      <ErrorMessage key={field}>{errorMessages[field]}</ErrorMessage>
    ));
}

const completedCheckMsg = (
  <div>
    Go to{" "}
    <a href="https://app.nada.bot/" target="_blank">
      {" "}
      Nada.bot
    </a>{" "}
    app to verify
  </div>
);
const isCheckComplete = Near.view(contract, "has_complete_profile_check", {
  account_id: accountId,
});
useEffect(() => {
  if (isCheckComplete === null) return;
  else if (isCheckComplete) return setPrompt(completedCheckMsg);
  else {
    const newValidity = isProfileValid(profile);
    if (newValidity.isValid) {
      Near.call(
        contract,
        "verify_social_profile_completeness",
        null,
        7e13,
        5e21
      );
    } else {
      // Update field errors
      const newFieldErrors = {};
      newValidity.invalidFields.forEach((field) => {
        newFieldErrors[field] = true;
      });
      setFieldErrors(newFieldErrors);
      setPrompt("Error Messages:");
    }
  }
}, [isCheckComplete]);
return (
  <div className="row">
    <div className="col-lg-6">
      <div>
        <h4>Edit profile of @{accountId}</h4>
      </div>
      <div className="mb-2">
        <Widget
          src="near/widget/MetadataEditor"
          props={{
            initialMetadata: profile,
            onChange: handleProfileChange,
            options: {
              name: { label: "Name" },
              image: { label: "Profile picture" },
              backgroundImage: { label: "Background image" },
              description: { label: "About" },
              tags: {
                label: "Tags",
                value: profile.tags,
                tagsPattern: "*/profile/tags/*",
                placeholder:
                  "rust, engineer, artist, humanguild, nft, learner, founder",
              },
              linktree: {
                links: [
                  {
                    label: "Twitter",
                    prefix: "https://twitter.com/",
                    name: "twitter",
                  },
                  {
                    label: "Github",
                    prefix: "https://github.com/",
                    name: "github",
                  },
                  {
                    label: "Telegram",
                    prefix: "https://t.me/",
                    name: "telegram",
                  },
                  {
                    label: "Website",
                    prefix: "https://",
                    name: "website",
                  },
                ],
              },
            },
          }}
        />
      </div>
      <div className="mb-2">
        <div className="btn btn-primary" onClick={handleSubmit}>
          Save & Verify
        </div>

        <a
          className="btn btn-outline-primary ms-2"
          href={`#/mob.near/widget/ProfilePage?accountId=${accountId}`}
        >
          View profile
        </a>
      </div>
    </div>
    <div className="col-lg-6">
      <div>
        <Widget
          src="mob.near/widget/ProfilePage"
          props={{ accountId, profile: profile }}
        />
      </div>
    </div>
    {prompt && (
      <Modal>
        <div className="close-icon" onClick={() => setPrompt("")}>
          X
        </div>
        <div> {prompt}</div>
        {Object.keys(fieldErrors).length > 0 && (
          <div>{renderErrorMessages()}</div>
        )}
      </Modal>
    )}
  </div>
);
