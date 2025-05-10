import {
  Flex,
  Title,
  Button,
  Alert,
  Group,
  FileButton,
  Skeleton,
  Badge,
  Tooltip,
  Divider,
  Box,
  Text, // Ensure Text is imported
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import appStrings from "../../utils/strings";
import useWeightState from "../../context/weight";
import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useNotification from "../../hooks/useNotification";
import { getJDApi, uploadJDApi } from "../../apis/jd";
import usePositionsState from "../../context/position";

export default function JDPage() {
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const position = usePositionsState((state) => state.position);
  const positionStatus = position?.status || "open"; // Ensure this defaults to 'open' if undefined
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });
  const llmName = useWeightState((state) => state.llmName);

  const editorController = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [jd, setJD] = useState(null);

  function handleSaveJD() {
    setIsLoading(true);
    const content = editorController?.getHTML();
    if (content === "<p></p>") {
      errorNotify({
        message: appStrings.language.jd.noContentError,
      });
      setIsLoading(false);
      return;
    }
    uploadJDApi({
      projectId,
      positionId,
      content,
      llmName,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsLoading(false);
      },
      onSuccess: (_) => {
        setIsLoading(false);
        successNotify({ message: appStrings.language.jd.saveSuccess });
      },
    });
  }

  useEffect(() => {
    getJDApi({
      projectId,
      positionId,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsFetching(false);
      },
      onSuccess: (jd) => {
        setJD(jd);
        setIsFetching(false);
        editorController?.commands.setContent(jd?.content || "");
      },
    });
  }, [editorController]);

  return (
    <Flex direction="column" gap="md">
      <HeadingLayout>
        <Title order={1}>{appStrings.language.jd.heading}</Title>
      </HeadingLayout>

      {/* Show the red text if positionStatus is not 'open' */}
      {positionStatus !== "open" && (
        <Text c="red">
          Please open this hiring request to upload a job description.
        </Text>
      )}

      {isFetching ? (
        <Skeleton height={400} />
      ) : (
        <RichTextEditor
          editor={editorController}
          style={{ height: "400px" }}
          editable={positionStatus === "open"} // Disable editor if status is not "open"
        >
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content
            style={{ maxHeight: "calc(100% - 47px)", overflowY: "auto" }}
          />
        </RichTextEditor>
      )}

      <Flex justify="flex-end" gap="md">
        {positionStatus === "open" && (
          <Button
            loading={isLoading}
            onClick={handleSaveJD}
            disabled={isFetching} // Disable save button when fetching
          >
            {appStrings.language.btn.save}
          </Button>
        )}
      </Flex>

      {Object.keys(jd?.extraction || {}).length ? <Divider /> : null}
      <Flex direction="column" gap="xl" mb="xl">
        {jd && jd.extraction && Object.keys(jd.extraction).length > 0 ? (
          <Divider />
        ) : null}
        <Flex direction="column" gap="xl" mb="xl">
          {jd && jd.extraction
            ? Object.entries(jd.extraction).map(([key, value]) => (
              <Flex direction="column" gap="md">
                <Flex align="center" gap="md">
                  <Title order={3}>{key}</Title>
                  <Tooltip>
                    <IconInfoSquareRounded size="1rem" />
                  </Tooltip>
                </Flex>
                <Flex wrap="wrap" gap="md">
                  {Object.entries(value).map(([key, value]) => (
                    <Badge
                      color="blue"
                      radius="xl"
                      size="lg"
                      rightSection={
                        <Badge color="gray" size="md">
                          {value}
                        </Badge>
                      }
                    >
                      {key}
                    </Badge>
                  ))}
                </Flex>
              </Flex>
            ))
            : null}
        </Flex>
      </Flex>
    </Flex>
  );
}
