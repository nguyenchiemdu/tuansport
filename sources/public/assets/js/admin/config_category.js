console.log("category Tree");

function getPrevElementByClass(element, className) {
  if (element.prevAll(`.${className}`).length) {
    element = element.prev();
  } else return 0;

  while (!element.hasClass(`${className}`)) {
    element = element.prev();
  }
  return element;
}

function getNextElementByClass(element, className) {
  if (element.nextAll(`.${className}`).length) {
    element = element.next();
  } else return 0;

  while (!element.hasClass(`${className}`)) {
    element = element.next();
  }
  return element;
}

function getIDAppendFolder(folder) {
  return {
    nextSiblingBeforeId: null,
    prevSiblingAfterId: folder?.children(".list-group-item").last().attr("id"),
  };
}

async function fetchData({ ...arguments }, categoryId) {
  console.log({ ...arguments });
  await fetch(`/admin/category/${categoryId}/position`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...arguments }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        $("#exampleModal").modal("hide");
      } else {
        alert("Có lỗi hệ thống");
      }
    });
}

$(document).ready(function (e) {
  $(document).on("hidden.bs.modal", ".modal", function () {
    $(this).removeData("bs.modal");
  });

  $(`#tree [aria-level = 1]`).each(function (e) {
    $(this).removeAttr("draggable");
  });

  let isDraggable = true;

  $(document).on("dragstart", function (e) {
    let id = e.target.getAttribute("data-bs-target");
    // Set data to drop
    if ($(e.target).attr("aria-level") != "1" || $(e.target).parent().attr("id") == "list-free-category") {
      e.originalEvent.dataTransfer.setData("element", e.target.getAttribute("data-bs-target"));
      e.originalEvent.dataTransfer.setData("index", $(e.target).index());
    } else {
      isDraggable = false;
    }
  });

  if ($('#list-free-category [role="treeitem"]').length == 0) {
    $("#item-test").removeClass("d-none");
  }

  $(document).on("drop", "#tree", async function (e) {
    if (isDraggable) {
      // Flag to fetch
      let flag = true;
      // Get element to drop
      let id = e.originalEvent.dataTransfer.getData("element");
      let element = $(`[data-bs-target="${id}"]`);

      let group = $(`#${id.slice(1)}`);
      let categoryId = $(element).attr("id");

      // Sibling element before drop
      let prevSiblingBefore = getPrevElementByClass($(element), "list-group-item");
      let nextSiblingBefore = getNextElementByClass($(element), "list-group-item");
      let prevSiblingAfter = getPrevElementByClass($(e.target), "list-group-item");
      let nextSiblingAfter = getNextElementByClass($(e.target), "list-group-item");

      let prevSiblingBeforeId = prevSiblingBefore ? $(prevSiblingBefore).attr("id") : undefined;
      let nextSiblingBeforeId = nextSiblingBefore ? $(nextSiblingBefore).attr("id") : undefined;
      let nextSiblingAfterId, prevSiblingAfterId;

      // Get level of target
      let level = parseInt($(e.target).attr("aria-level"));

      // Get group to append and swap
      let groupTargetId = $(e.target).attr("data-bs-target").slice(1);
      let groupTargetElement = $(`#${groupTargetId}`);
      let parentGroupId;
      let parentId;

      // Get index to swap
      let oldIndex = e.originalEvent.dataTransfer.getData("index");
      let newIndex = $(e.target).index();

      // Data to fetch
      let body;

      // Check if item doesn't come from List Free Category
      if ($(element).parent().attr("id") != "list-free-category") {
        if ($(element).attr("aria-level") == "1") return false;

        if ($(e.target).attr("aria-level") == "1") {
          parentId = $(e.target).attr("id");

          let { ...arg } = getIDAppendFolder($(groupTargetElement));

          $(element).css("padding-left", `${(level + 1) * 1.25}rem`);
          $(element).attr("aria-level", `${level + 1}`);

          await $(groupTargetElement).append($(element));

          body = {
            parentId,
            ...arg,
          };
          await fetchData({ ...body }, categoryId);
        } else {
          if (oldIndex != newIndex) {
            if ($(groupTargetElement).length != 0) {
              let nameFolder = $(e.target).text();
              $("#exampleModal").modal("show");

              $("#exampleModal #1").html(`Thêm vào trong thư mục ${nameFolder}`);
              $("#exampleModal #2").html("Thay đổi vị trí của danh mục");

              let target = $(e.target);

              // Detect event
              $(document).off("click", "#exampleModal");
              $(document).on("click", "#exampleModal", async function (e) {
                e.preventDefault();
                e.stopPropagation();

                group = await $(`#${id.slice(1)}`);

                let selection = await $(e.target).attr("id");

                switch (selection) {
                  case "1":
                    parentId = target.attr("id");
                    $(element).css("padding-left", `${(level + 1) * 1.25}rem`);
                    $(element).attr("aria-level", `${level + 1}`);

                    let { ...arg } = getIDAppendFolder($(groupTargetElement));

                    await $(groupTargetElement).append($(element));

                    body = {
                      parentId,
                      ...arg,
                    };
                    await fetchData({ ...body }, categoryId);
                    break;

                  case "2":
                    parentGroupId = target.parent().attr("id");
                    parentId = $(`[data-bs-target="#${parentGroupId}"]`).attr("id");

                    groupTargetElement = await $(`#${groupTargetId}`);

                    if (oldIndex !== newIndex) {
                      if (newIndex < oldIndex) {
                        nextSiblingAfterId = target.attr("id");
                        prevSiblingAfterId = prevSiblingAfter ? $(prevSiblingAfter).attr("id") : undefined;

                        target.before($(element));
                      } else {
                        prevSiblingAfterId = target.attr("id");
                        nextSiblingAfterId = nextSiblingAfter ? $(nextSiblingAfter).attr("id") : undefined;
                        if ($(groupTargetElement).length) {
                          groupTargetElement.after($(element));
                        } else {
                          target.after($(element));
                        }
                      }
                      if ($(group).length) await $(element).after(group);
                    }
                    body = {
                      // Category
                      parentId,
                      // Previous sibling after drop
                      prevSiblingAfterId,
                      // Next sibling after drop
                      nextSiblingAfterId,
                      // Previous sibling before drop
                      prevSiblingBeforeId,
                      // Next sibling before drop
                      nextSiblingBeforeId,
                    };
                    await fetchData({ ...body }, categoryId);
                    break;

                  default:
                    break;
                }
              });
            } else {
              parentGroupId = $(e.target).parent().attr("id");
              parentId = $(`[data-bs-target="#${parentGroupId}"]`).attr("id");

              group = $(`#${id.slice(1)}`);

              $(element).css("padding-left", `${level * 1.25}rem`);
              $(element).attr("aria-level", `${level}`);
              if (oldIndex !== newIndex) {
                if (newIndex < oldIndex) {
                  nextSiblingAfterId = $(e.target).attr("id");
                  prevSiblingAfterId = prevSiblingAfter ? $(prevSiblingAfter).attr("id") : undefined;
                  await $(e.target).before($(element));
                  await $(element).after($(group));
                } else {
                  prevSiblingAfterId = $(e.target).attr("id");
                  nextSiblingAfterId = nextSiblingAfter ? $(nextSiblingAfter).attr("id") : undefined;
                  await $(e.target).after($(element));
                  await $(element).after($(group));
                }
              }
              body = {
                //Category
                parentId,
                // Previous sibling after drop
                prevSiblingAfterId,
                // Next sibling after drop
                nextSiblingAfterId,
                // Previous sibling before drop
                prevSiblingBeforeId,
                // Next sibling before drop
                nextSiblingBeforeId,
              };
              await fetchData({ ...body }, categoryId);
            }
          }
        }
      } else {
        // Check if not
        if ($(e.target).attr("aria-level") == "1") {
          parentId = $(e.target).attr("id");

          let { ...arg } = getIDAppendFolder($(groupTargetElement));

          $(element).css("padding-left", `${(level + 1) * 1.25}rem`);
          $(element).attr("aria-level", `${level + 1}`);

          await $(groupTargetElement).append($(element));

          body = {
            parentId,
            ...arg,
          };
          await fetchData({ ...body }, categoryId);
        } else {
          if ($(groupTargetElement).length != 0) {
            let target = $(e.target);
            if ($(groupTargetElement).attr("aria-level") == "1") {
              parentId = $(e.target).attr("id");
              let group = $(`#${id.slice(1)}`)
            
              let { ...arg } = getIDAppendFolder($(groupTargetElement));

              $(element).css("padding-left", `${(level + 1) * 1.25}rem`);
              $(element).attr("aria-level", `${level + 1}`);

              await $(groupTargetElement).append($(element));

              body = {
                parentId,
                ...arg,
              };
              await fetchData({ ...body }, categoryId);
            } else {
              let nameFolder = target.text();

              $("#exampleModal").modal("show");

              $("#exampleModal #1").html(`Thêm vào trong thư mục ${nameFolder}`);
              $("#exampleModal #2").html("Thêm vào trong cây danh mục");

              $(document).off("click", "#exampleModal");
              $(document).on("click", "#exampleModal", async function (e) {
                e.preventDefault();
                e.stopPropagation();

                let selection = await $(e.target).attr("id");
                let { ...arg } = {};

                switch (selection) {
                  case "1":
                    parentId = $(target).attr("id");

                    body = {
                      parentId,
                      ...(arg = getIDAppendFolder($(groupTargetElement))),
                    };

                    $(element).css("padding-left", `${(level + 1) * 1.25}rem`);
                    $(element).attr("aria-level", `${level + 1}`);

                    await $(groupTargetElement).append($(element));
                    
                    await fetchData({ ...body }, categoryId);
                    break;

                  case "2":
                    parentGroupId = $(target).parent().attr("id");
                    parentId = $(`[data-bs-target="#${parentGroupId}"]`).attr("id");

                    body = {
                      parentId,
                      ...(arg = getIDAppendFolder($(groupTargetElement).parent())),
                    };
                    $(element).css("padding-left", `${level * 1.25}rem`);
                    $(element).attr("aria-level", `${level}`);

                    await $(groupTargetElement).parent().append($(element));

                    await fetchData({ ...body }, categoryId);

                    break;
                  default:
                    break;
                }
                
              });
            }
          } else {
            parentGroupId = $(e.target).parent().attr("id");
            parentId = $(`[data-bs-target="#${parentGroupId}"]`).attr("id");

            $(element).css("padding-left", `${level * 1.25}rem`);
            $(element).attr("aria-level", `${level}`);

            let group = $(`#${id.slice(1)}`)
            
            if (oldIndex !== newIndex) {
              if (newIndex < oldIndex) {
                nextSiblingAfterId = $(e.target).attr("id");
                prevSiblingAfterId = prevSiblingAfter ? $(prevSiblingAfter).attr("id") : undefined;
                $(e.target).before($(element));
                
                if ($(group).length) 
                    $(element).after($(group));
              } else {
                prevSiblingAfterId = $(e.target).attr("id");
                nextSiblingAfterId = nextSiblingAfter ? $(nextSiblingAfter).attr("id") : undefined;
                $(e.target).after($(element));

                if ($(group).length) 
                    $(element).after($(group));
              }
              
            }
            body = {
              // Category
              parentId: parentId,
              // Previous sibling after drop
              prevSiblingAfterId,
              // Next sibling after drop
              nextSiblingAfterId,
            };
            await fetchData({ ...body }, categoryId);
          }
        }
      }

      if ($('#list-free-category [role="treeitem"]').length == 0) {
        $("#item-test").removeClass("d-none");
      }
      // Save position of element
      return false;
    } else {
      isDraggable = true;
      return false;
    }
  });

  $("#list-free-category").on("drop", async function (e) {
    // Get element to drop
    if (isDraggable) {
        let id = e.originalEvent.dataTransfer.getData("element");
        let element = $(`[data-bs-target="${id}"]`);

        let prevSiblingBefore = getPrevElementByClass($(element), "list-group-item");
        let nextSiblingBefore = getNextElementByClass($(element), "list-group-item");

        let prevSiblingBeforeId = prevSiblingBefore ? prevSiblingBefore.attr("id") : undefined;
        let nextSiblingBeforeId = nextSiblingBefore ? nextSiblingBefore.attr("id") : undefined;

        // Config element
        await $(element).css("padding-left", `${1.25}rem`);
        await $(element).attr("aria-level", `1`);

        let oldIndex = e.originalEvent.dataTransfer.getData("index");
        let newIndex = $(e.target).index();

        let groupId = $(element).attr("data-bs-target").slice(1);
        let isGroup = $(`#${groupId}`);
        if ($(isGroup).length) {
            let group = $((`#${id.slice(1)}`))
            if (oldIndex !== newIndex) {
                if (newIndex < oldIndex) {
                  await $(e.target).before($(element));
                } else {
                  await $(e.target).after($(element));
                }
              }
            await $(element).after($(group))

        } else {
            if (oldIndex !== newIndex) {
                if (newIndex < oldIndex) {
                    await $(e.target).before($(element));
                } else {
                    await $(e.target).after($(element));
                }
            }
    }

      $("#item-test ").addClass("d-none");
      let body = {
        parentId: 0,
        prevSiblingBeforeId,
        nextSiblingBeforeId,
      };
      // Save position of element
      let categoryId = await $(element).attr("id");
      await fetchData({ ...body }, categoryId);
    } else {
      isDraggable = true;
      return false;
    }
  });

  $(".list-group-item").on("dragover", function (e) {
    e.preventDefault();
  });
});
