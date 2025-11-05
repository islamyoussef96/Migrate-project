document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Animate sections with GSAP
  gsap.utils.toArray("section").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  const listItems = document.querySelectorAll("#whyUsList .why-us-points");

  listItems.forEach((item, index) => {
	const delay = (index * 1.5); // 1s, 2s, 3s...

	gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      duration: 1, // same speed as animate.css fadeIn
      delay: delay
    });
  });

  const icons = Array.from(document.querySelectorAll("#iconColumn img"));

  icons.forEach((icon, index) => {
    const delay = index + 1; 

    gsap.from(icon, {
      scrollTrigger: {
        trigger: "#iconColumn",
        start: "top 80%", 
        toggleActions: "play none none none"
      },
      y: -200,  
      opacity: 0,
      duration: 1.2,
      delay: delay,
      ease: "back.out(1.7)"
    });
  });
 

  const subscribeBtn = document.querySelector('.btn-migrate[href="#contact"]');

  if (subscribeBtn) {
    subscribeBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Set dropdown value
      const topicSelect = document.getElementById("contactTopic");
      if (topicSelect) {
        topicSelect.value = "newsletter";
      }

      // Scroll to contact section smoothly
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Utility: Wait until all SVG <object> elements are loaded
  function waitForSVGs(callback) {
    const objects = document.querySelectorAll("object");
    let remaining = objects.length;

    if (remaining === 0) return callback();

    objects.forEach((obj) => {
      if (obj.contentDocument) {
        if (--remaining === 0) callback();
      } else {
        obj.addEventListener("load", () => {
          if (--remaining === 0) callback();
        });
      }
    });
  }

// Wait for SVG to exist in DOM before attaching load event
  const svgObject = document.getElementById('svg-object');
  if (!svgObject) return;

  svgObject.addEventListener('load', function () {
    const svgDoc = svgObject.contentDocument;
    if (!svgDoc) return;

    // Reusable hover fade toggle
    function setupHoverFade(groupId, hideIds = [], showIds = []) {
      const group = svgDoc.getElementById(groupId);
      const hideEls = hideIds.map(id => svgDoc.getElementById(id));
      const showEls = showIds.map(id => svgDoc.getElementById(id));

      if (group && hideEls.every(Boolean) && showEls.every(Boolean)) {
        group.addEventListener('mouseenter', () => {
          hideEls.forEach(el => {
            el.style.opacity = '0';
            //el.style.pointerEvents = 'none';
          });
          showEls.forEach(el => {
            el.style.opacity = '1';
            //el.style.pointerEvents = 'auto';
          });
        });

        group.addEventListener('mouseleave', () => {
          hideEls.forEach(el => {
            el.style.opacity = '1';
            //el.style.pointerEvents = 'auto';
          });
          showEls.forEach(el => {
            el.style.opacity = '0';
            //el.style.pointerEvents = 'none';
          });
        });
      }
    }

    // Handle 8 section groups
    for (let i = 1; i <= 8; i++) {
      setupHoverFade(
        `migrate_section_group_${i}`,
        [`migrate_section_${i}`],
        [`migrate_section_${i}_hover`]
      );
    }

    // Handle 2 circle groups
    for (let i = 1; i <= 2; i++) {
      setupHoverFade(
        `migrate_circle_group_${i}`,
        [`migrate_circle_${i}_rect`, `migrate_circle_${i}_path`],
        [`migrate_circle_${i}_text`]
      );
    }
	
const sectionGroups = Array.from({ length: 8 }, (_, i) =>
    svgDoc.getElementById(`migrate_section_group_${i + 1}`)
  );
  const circleGroups = [
    svgDoc.getElementById("migrate_circle_group_1"),
    svgDoc.getElementById("migrate_circle_group_2"),
  ];
                        
   gsap.set([...sectionGroups, ...circleGroups], { opacity: 0 });               
                        
	gsap.timeline({
    scrollTrigger: {
      trigger: "#services",   // Services section
      start: "top 80%",
      toggleActions: "play none none none",
    },
  })
  .to(sectionGroups, {
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.8, // sections appear one by one
  })
  .to(circleGroups, {
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.5, // circle 2 first
  }, "+=0.2");                        



  });

  
});


$(document).ready(function () {
  $('.btn-subscribe[href="#contact"]').on("click", function (e) {
    e.preventDefault();

    $("html, body").animate(
      {
        scrollTop: $("#contact").offset().top,
      },
      500,
      function () {
        $("#contactTopic option").each(function () {
          if ($(this).val() === "newsletter") {
            $(this).prop("selected", true);
          } else {
            $(this).prop("selected", false);
          }
        });

        $("#contactTopic").trigger("change");
      }
    );
  });
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    var form = $(this);
    var spinner = $("#btnSpinner");
    var btnText = $(".btn-text");
    var submitBtn = $("#submitBtn");
    var actionUrl = form.attr("action");
    var formData = new FormData(this);
    spinner.removeClass("d-none");
    btnText.text("Submitting...");
    submitBtn.prop("disabled", true);
    $.ajax({
      url: actionUrl,
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        "X-CSRF-TOKEN": $('input[name="_token"]').val(),
      },
      success: function (response) {
        spinner.addClass("d-none");
        btnText.text("Submit");
        submitBtn.prop("disabled", false);
        var modal = new bootstrap.Modal(
          document.getElementById("migrateModal")
        );
        modal.show();
        form[0].reset();
      },
      error: function (xhr) {
        console.error(xhr.responseText);
        alert("There was a problem submitting the form. Please try again.");
        spinner.addClass("d-none");
        btnText.text("Submit");
        submitBtn.prop("disabled", false);
      },
    });
  });
  $(document).on("click", ".pagination a", function (e) {
    e.preventDefault();

    var url = $(this).attr("href");
    if (!url || url === "#") return;

    $.ajax({
      url: url,
      type: "GET",
      beforeSend: function () {
        $("#newsContainer").addClass("opacity-50"); // optional loading state
      },
      success: function (data) {
        $("#newsContainer").html(data);
      },
      complete: function () {
        $("#newsContainer").removeClass("opacity-50");
      },
      error: function () {
        alert("Failed to load news. Please try again.");
      },
    });
  });
  
	let currentVisible = null;
const animatedContainers = new Set();

const observer = new IntersectionObserver(
  (entries) => {
    // Sort entries by vertical position (top to bottom)
    const visibleContainers = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visibleContainers.length > 0) {
      const newVisible = visibleContainers[0].target;

      // Skip if already animated
      if (animatedContainers.has(newVisible)) return;

      // Add animation to the new visible container
      $(newVisible)
        .find("[data-animate]")
        .each(function () {
          const $el = $(this);
          const animation = $el.data("animate");
          const delay = $el.data("delay") || "0s";

          $el.css("--animate-delay", delay)
            .removeClass("invisible")
            .addClass(`animate__animated ${animation}`);
        });

      // Mark as animated
      animatedContainers.add(newVisible);
      currentVisible = newVisible;
    }
  },
  {
    threshold: window.innerWidth < 768 ? 0.6 : 0.9, // Adjust for more/less of section in view
  }
);

// Observe your target containers
document.querySelectorAll("section").forEach((el) => observer.observe(el));




});
